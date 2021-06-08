import './App.scss';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import 'whatwg-fetch';
import { DateTime, Duration } from 'luxon';
import sortBy from 'lodash/sortBy';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, ResponsiveContainer, ReferenceArea } from 'recharts'

import { DateRange, Item, Slug } from './types';
import { toSlug, nowDateRange } from './utils';
import { loadForDate, loadForDateRange } from './DataService';

const App = (): JSX.Element => {

  const [data, setData] = useState<{ [slug: string]: Item[] | undefined }>({});

  const [dateRange, setDateRange] = useState<DateRange>(nowDateRange());

  const addNewData = useCallback((slug: Slug, items: Item[]) => {
    setData(data => ({
      ...data,
      [slug]: items,
    }));
  }, [])

  useEffect(() => {
    const startSlug = toSlug(dateRange.start);
    const endSlug = toSlug(dateRange.end)

    const load = async () => {
      if (!data[startSlug]) {
        loadForDateRange([dateRange.start]).subscribe((items: Item[]) => addNewData(startSlug, items))
      }
      if (startSlug !== endSlug && !data[endSlug]) {
        addNewData(endSlug, await loadForDate(dateRange.end));
      }
    }

    load();
  }, [addNewData, dateRange, data]);

  const handleLoadPrevious = useCallback(() => {
    setDateRange(dr => {
      if (data[toSlug(dr.start)]) {
        return {
          ...dr,
          start: dr.start.minus(Duration.fromObject({ days: 1, }))
        };
      } else {
        return dr;
      }
    })
  }, [data])

  type ChartData = {
    label: string;
    reserveRatio: number;
  }

  const chartData = useMemo(() => {

    const slugs = sortBy(Object.keys(data))

    const allItems = slugs.reduce((all: Item[], slug) => {
      return [...all, ...(data[slug] ?? [])];
    }, []);

    return allItems.reduce((acc: ChartData[], item, index) => {
      if (index % Math.pow(slugs.length, 2) === 0) {
        return [
          ...acc,
          {
            label: DateTime.fromISO(item.time).toLocaleString(DateTime.DATETIME_SHORT),
            reserveRatio: parseInt(item.reserveRatio, 10),
            stable: Math.round(parseFloat(item.stableCoinRatio) * 100) / 100,
            reserve: parseInt(item.reserveCoinRatio, 10),

          }
        ]
      } else {
        return acc;
      }

    }, []);
  }, [data]);



  return (
    <div className="App container">
      <a className="github-fork-ribbon" href="https://github.com/bdkent/sigmausd-history" data-ribbon="Fork me on GitHub" title="Fork me on GitHub" target="_blank" rel="noreferrer">Fork me on GitHub</a>
      <h1>SigmaUSD History</h1>

      <h2>
        {dateRange.start.toLocaleString(DateTime.DATE_FULL)}{!dateRange.start.equals(dateRange.end) && <>{' '}—{' '}{dateRange.end.toLocaleString(DateTime.DATE_FULL)}</>}
      </h2>
      <button className="btn btn-primary" onClick={handleLoadPrevious}>Load Previous Day</button>

      <hr />

      <div className="row">
        <div className="col">
          <div className=" card text-dark bg-light mb-3" >
            <div className="card-header">Reserve Ratio (%)</div>
            <div className="card-body ">
              <div className="reserveRatioChartWrapper">
                {chartData && (
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart width={730} height={250} data={chartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="reserveRatio" stroke="#8884d8" />
                      <ReferenceArea y1={400} y2={800} fill="green" opacity={.25} alwaysShow />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <div className=" card text-dark bg-light mb-3" >
            <div className="card-header">SigmaUSD ($)</div>
            <div className="card-body ">
              <div className="reserveRatioChartWrapper">
                {chartData && (
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart width={730} height={250} data={chartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="stable" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className=" card text-dark bg-light mb-3" >
            <div className="card-header">SigmaRSV</div>
            <div className="card-body ">
              <div className="reserveRatioChartWrapper">
                {chartData && (
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart width={730} height={250} data={chartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="reserve" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr />
      <footer className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a href="http://sigmausd.io" className="nav-link">sigmausd.io</a>
            </li>
          </ul>
        </div>
      </footer>

    </div>
  );
}

export default App;
