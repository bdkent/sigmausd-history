import  { useMemo, } from 'react';
import 'whatwg-fetch';
import { DateTime, } from 'luxon';
import sortBy from 'lodash/sortBy';
import { TimeSeries } from 'pondjs';

import { columns } from '../components/columns';
import { DataMap, Item, TimeSeriesData } from '../types';


type Row = Readonly<[
    date: Date,
    reserveRatio: number,
    stable: number,
    reserve: number,
    ms: number
]>;

export const useTimeSeriesData = (data: DataMap): TimeSeriesData | undefined => {

    return useMemo(() => {

        const slugs = sortBy(Object.keys(data))

        const allItems = slugs.reduce((all: Item[], slug) => {
            return [...all, ...(data[slug] ?? [])];
        }, []);

        const divisor = Math.max(Math.ceil(allItems.length / 5000), 1)

        const chartData = allItems.reduce((acc: Readonly<Row>[], item, index) => {
            if (index % divisor === 0) {
                const dateTime = DateTime.fromISO(item.time);
                return [
                    ...acc,
                    [
                        dateTime.toJSDate(),
                        parseInt(item.reserveRatio, 10),
                        Math.round(parseFloat(item.stableCoinRatio) * 100) / 100,
                        parseInt(item.reserveCoinRatio, 10),
                        dateTime.toMillis(),
                    ] as const
                ]
            } else {
                return acc;
            }
        }, []);


        if (!chartData?.length) {
            return undefined;
        }

        const points = sortBy(chartData, f => f[4]);

        return {
            start: points[0]?.[0],
            end: points[points.length - 1]?.[0],
            timeSeries: new TimeSeries({
                name: 'Data',
                columns: ['time', ...columns],
                points,
            })
        };
    }, [data]);
};
