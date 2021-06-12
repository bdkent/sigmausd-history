import './App.scss';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import 'whatwg-fetch';
import { DateTime, } from 'luxon';
import sortBy from 'lodash/sortBy';


import { DateRange, Item, Slug } from './types';
import { toSlug, nowDateRange } from './utils';
import { loadForDateRange } from './DataService';
import range from 'lodash/range';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import {
  Charts,
  ChartContainer,
  ChartRow,
  YAxis,
  LineChart,
  Resizable,
  Baseline,
  EventMarker,

} from "react-timeseries-charts";
import { TimeRange, TimeSeries } from 'pondjs';

const NullMarker = () => {
  return <g />;
};

const firstRecord = DateTime.utc(2021, 5, 9, 13, 38)

const columns = ['reserveRatio', 'stable', 'reserve'] as const
type ColumnTypes = typeof columns[number];

const columnTitles = {
  reserveRatio: 'Reserve Ratio (%)',
  stable: 'SigmaUSD Ratio ($)',
  reserve: 'SigmaRSV Ratio',
} as const;

const columnFormatter = {
  reserveRatio: (v: string) => `${v} %`,
  stable: (v: string) => `$${v}`,
  reserve: (v: string) => v,
} as const;

const App = (): JSX.Element => {

  const [data, setData] = useState<{ [slug: string]: Item[] | undefined }>({});

  const [dateRange, setDateRange] = useState<DateRange>(nowDateRange());

  const [selection, setSelection] = useState<unknown>();


  const [timeRange, setTimeRange] = useState<TimeRange | undefined>(undefined);

  useEffect(() => {
    setTimeRange(undefined);
  }, [dateRange])



  const addNewData = useCallback((slug: Slug, items: Item[]) => {
    setData(data => ({
      ...data,
      [slug]: items,
    }));
  }, [])

  useEffect(() => {
    const nums = range(dateRange.end.diff(dateRange.start, 'days').days + 1);

    const dts = nums.map(n => dateRange.start.plus({ days: n }));

    loadForDateRange(dts).subscribe(([date, items]) => addNewData(toSlug(date), items))

  }, [addNewData, dateRange]);

  const handleRangeChange = useCallback((dateRange?: [Date, Date]) => {
    if (!dateRange) {
      setData({})
      setDateRange(nowDateRange());
    } else {
      const [startDate, endDate] = dateRange;
      setData({})
      setDateRange(dr => {
        const start = DateTime.fromJSDate(startDate)
        const end = DateTime.fromJSDate(endDate);
        if (start.equals(dr.start) && end.equals(dr.end)) {
          return dr;
        }
        return {
          start,
          end,
        }

      })
    }
  }, [])

  type Row = Readonly<[
    date: Date,
    reserveRatio: number,
    stable: number,
    reserve: number,
    ms: number
  ]>

  const timeSeriesData = useMemo(() => {

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

  const pickerProps = useMemo(() => ({
    value: [dateRange.start.toJSDate(), dateRange.end.toJSDate()],
    maxDate: DateTime.now().toJSDate(),
    minDate: firstRecord.toJSDate(),
  }), [dateRange])

  useEffect(() => {
    if (timeSeriesData) {
      setTimeRange(new TimeRange(timeSeriesData.start, timeSeriesData.end))
    } else {
      setTimeRange(undefined);
    }
  }, [timeSeriesData])

  const [tracked, setTracked] = useState<Date | undefined>()

  const ref = useRef<HTMLDivElement>(null)

  const [column, setColumn] = useState<ColumnTypes>('reserveRatio')

  const tipAddress = useMemo(() => {
    const addr = document.querySelector<HTMLMetaElement>('meta[name=tip]')?.content;
    return addr?.includes('REACT_APP_TIP') ? undefined : addr;
  }, []);

  return (
    <div className="App container min-vh-100 ">
      <a className="github-fork-ribbon" href="https://github.com/bdkent/sigmausd-history" data-ribbon="Fork me on GitHub" title="Fork me on GitHub" target="_blank" rel="noreferrer">Fork me on GitHub</a>
      <div className="d-flex flex-column min-vh-100">
        <div>
          <h1>SigmaUSD History</h1>

          <div className="d-flex flex-wrap">
            <div className="flex-fill">
              <DateRangePicker
                {...pickerProps}
                onChange={handleRangeChange}
                format="MMM d, y"
              />
            </div>
            <div className="flex-fill">
              <select value={column} className="form-select" onChange={(e) => {
                setColumn(e.target.value as ColumnTypes)
              }}>
                {columns.map(c => (<option key={c} value={c}>{columnTitles[c]}</option>))}
              </select>
            </div>
          </div>
          <hr />
        </div>
        <div className="flex-grow-1 " ref={ref}>
          {timeSeriesData && (
            <Resizable>
              <ChartContainer
                timeRange={timeRange}

                maxTime={pickerProps.maxDate}
                minTime={pickerProps.minDate}
                timeAxisAngledLabels={true}
                timeAxisHeight={65}

                enablePanZoom={true}
                onTimeRangeChanged={setTimeRange}
                onTrackerChanged={(t: Date) => setTracked(t)}
                minDuration={1000 * 60 * 60}
              >
                <ChartRow height={(ref.current?.offsetHeight ?? 400) * .75}>
                  <YAxis
                    id="y"
                    label={columnTitles[column]}
                    min={timeSeriesData.timeSeries.min(column, (x: unknown) => x)}
                    max={timeSeriesData.timeSeries.max(column)}
                    width="60"
                    type="linear"

                  />
                  <Charts>
                    <Baseline axis="y" value={400} label="400%" position="left" />
                    <Baseline axis="y" value={800} label="800%" position="left" />
                    <LineChart
                      axis="y"
                      breakLine={false}
                      series={timeSeriesData.timeSeries}
                      columns={["time", column]}
                      selection={selection}
                      onSelectionChange={(s: unknown) =>
                        setSelection(s)
                      }
                      interpolation="curveBasis"

                    />
                    {tracked ?
                      <EventMarker
                        type="point"
                        axis="y"
                        event={timeSeriesData.timeSeries.atTime(tracked)}
                        markerLabel={columnFormatter[column](`${timeSeriesData.timeSeries.atTime(tracked).get(column)}`)}
                        column={column}
                        markerRadius={3}
                        markerLabelAlign="left"
                      /> : <NullMarker />
                    }
                  </Charts>
                </ChartRow>
              </ChartContainer>
            </Resizable>
          )}

        </div>
        <div>
          <hr />
          <footer className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a href="http://sigmausd.io" className="nav-link" target="_blank" rel="noreferrer">sigmausd.io</a>
                </li>
              </ul>
              {tipAddress && <a href={`https://explorer.ergoplatform.com/en/addresses/${tipAddress}`} target="_blank" rel="noreferrer">&hearts; tips welcome</a> }
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;
