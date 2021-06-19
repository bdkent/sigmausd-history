import './App.scss';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import 'whatwg-fetch';
import { DateTime } from 'luxon';
import range from 'lodash/range';

import { DataMap, DateRange, Item, PickerProps, Slug } from './types';
import { toSlug, nowDateRange, toDay } from './utils';
import { loadForDateRange } from './DataService';
import { Footer } from './components/Footer';
import { ColumnTypes } from './components/columns';
import { Toolbar } from './components/Toolbar';
import { ProgressBar } from './components/ProgressBar';
import { ForkMe } from './components/ForkMe';
import { MainChart } from './components/MainChart';
import { useTimeSeriesData } from './hooks/useTimeSeriesData';

const firstRecord = DateTime.utc(2021, 5, 9, 13, 38);

const App = (): JSX.Element => {
  const [data, setData] = useState<DataMap>({});

  const [dateRange, setDateRange] = useState<DateRange>(nowDateRange());

  const [progress, setProgress] = useState(0);

  const handleResetProgress = useCallback(() => setProgress(0), []);

  const addNewData = useCallback((slug: Slug, items: Item[]) => {
    setData((data) => ({
      ...data,
      [slug]: items,
    }));
  }, []);

  const dateDiff = useMemo(
    () => toDay(dateRange.end).diff(toDay(dateRange.start), 'days').days + 1,
    [dateRange]
  );

  useEffect(() => {
    const nums = range(dateDiff);
    setProgress(nums.length);

    const dts = nums.map((n) => dateRange.start.plus({ days: n }));

    loadForDateRange(dts).subscribe(([date, items]) => {
      addNewData(toSlug(date), items);
      setProgress((n) => n - 1);
    });
  }, [addNewData, dateRange, dateDiff]);

  const handleRangeChange = useCallback((dateRange?: [Date, Date]) => {
    if (!dateRange) {
      setData({});
      setDateRange(nowDateRange());
    } else {
      const [startDate, endDate] = dateRange;
      setData({});
      setDateRange((dr) => {
        const start = DateTime.fromJSDate(startDate);
        const end = DateTime.fromJSDate(endDate);
        if (start.equals(dr.start) && end.equals(dr.end)) {
          return dr;
        }
        return {
          start,
          end,
        };
      });
    }
  }, []);

  const timeSeriesData = useTimeSeriesData(data);

  const pickerProps: PickerProps = useMemo(
    () => ({
      value: [dateRange.start.toJSDate(), dateRange.end.toJSDate()],
      maxDate: DateTime.now().toJSDate(),
      minDate: firstRecord.toJSDate(),
    }),
    [dateRange]
  );

  const ref = useRef<HTMLDivElement>(null);

  const [column, setColumn] = useState<ColumnTypes>('reserveRatio');

  return (
    <div className="App container min-vh-100">
      <ProgressBar
        progress={progress}
        dayCount={dateDiff}
        onComplete={handleResetProgress}
      />
      <ForkMe />
      <div className="d-flex flex-column min-vh-100">
        <div>
          <h1>SigmaUSD History</h1>
          <Toolbar
            pickerProps={pickerProps}
            column={column}
            onColumnChange={setColumn}
            onRangeChange={handleRangeChange}
          />
          <hr />
        </div>
        <div className="flex-grow-1 " ref={ref}>
          {timeSeriesData && (
            <MainChart
              column={column}
              timeSeriesData={timeSeriesData}
              pickerProps={pickerProps}
              chartRowHeight={(ref.current?.offsetHeight ?? 400) * 0.75}
            />
          )}
        </div>
        <div>
          <hr />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default App;
