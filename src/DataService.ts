
import { DateTime } from "luxon";
import { connection } from "./ jsstore_con";
import { Item } from "./types";
import { todayUTC, toSlug } from "./utils";

async function load(date: DateTime): Promise<Item[]> {
    const slug = toSlug(date);
    const url = `${process.env.PUBLIC_URL}/data/daily/${slug}.json`
    // TODO: validate against schema https://github.com/pelotom/runtypes ?
    const resp = await fetch(url);
    return await resp.json();
}

let isReady = false;
async function initialize() {
    isReady = await connection.initDb({
        name: 'sigmausd',
        tables: [
            {
                name: 'Items',
                columns: {
                    id: { primaryKey: true, dataType: "number" },
                    time: { notNull: true, dataType: "string" },
                    reserveRatio: { notNull: true, dataType: "string" },
                    stableCoinPrice: { notNull: true, dataType: "string" },
                    stableCoinRatio: { notNull: true, dataType: "string" },
                    reserveCoinPrice: { notNull: true, dataType: "string" },
                    reserveCoinRatio: { notNull: true, dataType: "string" },
                }
            },
        ]
    });
};

initialize();



export async function loadForDate(date: DateTime): Promise<Item[]> {
    const today = todayUTC();
    const isToday = today.equals(date)

    if (isReady && !isToday) {
        // check db
        const nextDate = date.plus({ days: 1 }).minus({ minutes: 5 })

        const items: Item[] = await connection.select({
            from: "Items",
            where: {
                id: {
                    '-': {
                        low: date.toMillis(),
                        high: nextDate.toMillis(),
                    }
                },
            }
        });

        if (items.length > 0) {
            return items;
        }

    }

    const items = await load(date);

    if (isReady && !isToday) {

        await connection.insert({
            into: 'Items',
            upsert: true,
            values: items.map(i => ({
                ...i,
                id: DateTime.fromISO(i.time).toMillis()
            }))
        })
    }

    return items;
}
