import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Charts,
  ChartContainer,
  ChartRow,
  YAxis,
  LineChart,
  Resizable,
  Baseline,
  EventMarker,
} from 'react-timeseries-charts';
import { TimeRange } from 'pondjs';

import { ColumnTypes, columnTitles, columnFormatter } from './columns';
import { CrossHairs } from './CrossHairs';
import { PickerProps, TimeSeriesData } from '../types';

const showCrossHair = false;

type MainChartProps = {
  timeSeriesData: TimeSeriesData;
  pickerProps: PickerProps;
  column: ColumnTypes;
  chartRowHeight: number;
};

export const MainChart = memo((props: MainChartProps) => {
  const { pickerProps, timeSeriesData, column, chartRowHeight } = props;

  const [tracked, setTracked] = useState<Date | undefined>();

  const [selection, setSelection] = useState<unknown>();

  const [mouse, setMouse] = useState<readonly [number, number] | undefined>();

  const [timeRange, setTimeRange] = useState<TimeRange | undefined>(undefined);

  useEffect(() => {
    setTimeRange(undefined);
  }, [pickerProps]);

  useEffect(() => {
    if (timeSeriesData) {
      setTimeRange(new TimeRange(timeSeriesData.start, timeSeriesData.end));
    } else {
      setTimeRange(undefined);
    }
  }, [timeSeriesData]);

  const handleMouseMove = useCallback(
    (x?: number, y?: number) =>
      setMouse(x && y ? ([x, y] as const) : undefined),
    []
  );

  const handleTrackerChanged = useCallback((t: Date) => {
    setTracked(t);
    if (!t) {
      setMouse(undefined);
    }
  }, []);

  const handleSelectionChange = useCallback(
    (s: unknown) => setSelection(s),
    []
  );

  const eventMarkerProps = useMemo(() => {
    if (tracked) {
      return {
        event: timeSeriesData.timeSeries.atTime(tracked),
        info: [
          {
            label: columnTitles[column],
            value: columnFormatter[column](
              `${timeSeriesData.timeSeries.atTime(tracked).get(column)}`
            ),
          },
        ] as const,
      };
    } else {
      return undefined;
    }
  }, [timeSeriesData, tracked, column]);

  const columns = useMemo(() => ['time', column] as const, [column]);

  return (
    <Resizable>
      <ChartContainer
        timeRange={timeRange}
        maxTime={pickerProps.maxDate}
        minTime={pickerProps.minDate}
        timeAxisAngledLabels={true}
        timeAxisHeight={65}
        onMouseMove={handleMouseMove}
        enablePanZoom={true}
        onTimeRangeChanged={setTimeRange}
        onTrackerChanged={handleTrackerChanged}
        minDuration={1000 * 60 * 60}
      >
        <ChartRow height={chartRowHeight}>
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
              columns={columns}
              selection={selection}
              onSelectionChange={handleSelectionChange}
              interpolation="curveBasis"
            />
            {tracked ? (
              <EventMarker
                {...eventMarkerProps}
                type="flag"
                axis="y"
                infoWidth={180}
                column={column}
                markerRadius={3}
                markerStyle={{ fill: 'black' }}
              />
            ) : (
              <NullMarker />
            )}
            {showCrossHair && mouse ? (
              <CrossHairs x={mouse[0]} y={mouse[1]} />
            ) : (
              <g />
            )}
          </Charts>
        </ChartRow>
      </ChartContainer>
    </Resizable>
  );
});

const NullMarker = memo(() => {
  return <g />;
});
