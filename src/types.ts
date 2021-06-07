import { DateTime, } from 'luxon';

export type Slug = string

export type Item = {
    "time": string;
    "reserveRatio": string;
    "stableCoinPrice": string;
    "stableCoinRatio": string;
    "reserveCoinPrice": string;
    "reserveCoinRatio": string;
}

export type DateRange = {
    start: DateTime;
    end: DateTime;
}