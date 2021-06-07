import { DateTime } from "luxon";
import { Slug } from "./types";
import padStart from 'lodash/padStart';

export function nowDateRange() {

    const today = todayUTC();
    return {
        start: today, end: today
    };
}

export function todayUTC() {
    const now = DateTime.now().toUTC();
    return DateTime.utc(now.year, now.month, now.day);
}

export function toSlug(date: DateTime): Slug {
    return `${date.year}-${padStart(date.month.toString(), 2, '0')}-${padStart(date.day.toString(), 2, '0')}`
}
