import { DateTime } from 'luxon';
import { DateRange, Slug } from './types';
import padStart from 'lodash/padStart';

export function nowDateRange(): DateRange {
  const endTime = DateTime.now().toUTC();
  const startTime = endTime.minus({ hours: 12 });

  return {
    start: toDay(startTime),
    end: toDay(endTime),
  };
}

export function toDay(d: DateTime): DateTime {
  return DateTime.utc(d.year, d.month, d.day);
}

export function todayUTC(): DateTime {
  const now = DateTime.now().toUTC();
  return toDay(now);
}

export function toSlug(date: DateTime): Slug {
  const d = date.toUTC();
  return `${d.year}-${padStart(d.month.toString(), 2, '0')}-${padStart(
    d.day.toString(),
    2,
    '0'
  )}`;
}
