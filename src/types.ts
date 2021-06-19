import { DateTime, } from 'luxon';
import { TimeSeries } from 'pondjs';

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

export type PickerProps = {
    value: [Date, Date];
    maxDate: Date;
    minDate: Date;
};

export type TimeSeriesData = {
    start: Date;
    end: Date;
    timeSeries: TimeSeries;
};

export type DataMap = Record<Slug, Item[] | undefined>;
