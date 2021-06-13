import { DateTime } from "luxon";
import { Slug } from "./types";
import padStart from 'lodash/padStart';

export function nowDateRange() {
   const endTime =  DateTime.now().toUTC();
   const startTime = endTime.minus({hours: 12});

    return {
        start: toDay(startTime), 
        end: toDay(endTime),
    };
}

export function toDay(d: DateTime): DateTime {
    return DateTime.utc(d.year, d.month, d.day);
}

export function todayUTC() {
    const now = DateTime.now().toUTC();
    return toDay(now);
}

export function toSlug(date: DateTime): Slug {
    return `${date.year}-${padStart(date.month.toString(), 2, '0')}-${padStart(date.day.toString(), 2, '0')}`
}
