import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Pool } from 'pg';
import { Line } from 'react-chartjs-2';
import dayjs from 'dayjs';
import faker from 'faker';

// Components
import DataTable from '../components/DataTable';

// Styles

// Types
import type { QueueMetrics, QueueData } from '../types';

import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';

type AppProps = {
  data: QueueMetrics[];
  paginatedData: Record<number, QueueMetrics[]>;
  pageCount: number;
  eventsPerHour: { time: string; eventCount: number }[];
  logs: { timestamp: string; message: string }[];
  errors: { timestamp: string; code: number; message: string }[];
};

// Constants
const ITEMS_PER_PAGE = 10;

export const getStaticProps: GetStaticProps<AppProps> = async () => {
  const connectionString = process.env.POSTGRES_URL;

  const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  const client = await pool.connect();
  const rawResults = await client.query<QueueData>(
    'select * from queue_monitoring',
  );

  const eventsPerHour = await client.query(`SELECT* FROM (SELECT distinct
    date_trunc('hour', enqueue_time) AS hour,
    queue_name,
    count(queue_name) OVER (PARTITION BY queue_name, date_trunc('hour', enqueue_time)) AS events_count
 FROM queue_monitoring) as counts
 RIGHT JOIN (SELECT INTERVAL_START,
       INTERVAL_START + interval '00:59:59' AS INTERVAL_STOP
     FROM
       (SELECT GENERATE_SERIES(MIN(date_trunc('hour', enqueue_time))::TIMESTAMP,
 
                         MAX(date_trunc('hour', enqueue_time))::TIMESTAMP,
                         '1h')::TIMESTAMP AS INTERVAL_START
         FROM QUEUE_MONITORING) AS series) as intervals ON (date_trunc('hour', hour) = interval_start) `);

  const data = rawResults.rows.map((row) => ({
    ...row,
    enqueue_time: row.enqueue_time.toISOString(),
    dequeue_time: row.dequeue_time ? row.dequeue_time.toISOString() : '',
  }));

  const paginatedDataObject: Record<number, QueueMetrics[]> = {};

  let page = 0;

  for (let index = 0; index < data.length; index += ITEMS_PER_PAGE) {
    paginatedDataObject[page + 1] = data.slice(index, index + ITEMS_PER_PAGE);
    page += 1;
  }

  const logs = [];
  const errors = [];

  for (let index = 0; index < 50; index += 1) {
    logs.push({
      timestamp: faker.date.past().toISOString(),
      message: faker.git.commitMessage(),
    });
    errors.push({
      timestamp: faker.date.past().toISOString(),
      code: faker.datatype.number(),
      message: faker.git.commitMessage(),
    });
  }

  return {
    props: {
      data: data,
      pageCount: Math.ceil(data.length / ITEMS_PER_PAGE),
      paginatedData: paginatedDataObject,
      eventsPerHour: eventsPerHour.rows.map((row) => ({
        time: row.interval_start.toISOString(),
        eventCount: Number(row.events_count) ?? 0,
      })),
      logs: logs,
      errors: errors,
    }, // will be passed to the page component as props
    revalidate: 60,
  };
};

const App: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  data,
  paginatedData,
  pageCount,
  eventsPerHour,
  logs,
  errors,
}) => {
  const [activeTab, setActiveTab] = useState<
    'metrics' | 'data' | 'errors' | 'logs'
  >('metrics');

  const [timespan, setTimespan] = useState({
    start: eventsPerHour[0].time,
    end: eventsPerHour[eventsPerHour.length - 1].time,
  });

  const eventsPerHourFiltered = useMemo(
    () =>
      eventsPerHour.filter((item) => {
        return (
          dayjs(item.time) >= dayjs(timespan.start) &&
          dayjs(item.time) <= dayjs(timespan.end)
        );
      }),
    [eventsPerHour, timespan.end, timespan.start],
  );

  const avgTimeInQueue = useMemo(() => {
    return (
      data
        .filter((item) => {
          return (
            dayjs(item.enqueue_time) >= dayjs(timespan.start) &&
            dayjs(item.enqueue_time) <= dayjs(timespan.end)
          );
        })
        .reduce((acc, curr) => {
          if (curr.dequeue_time) {
            return (
              acc +
              (new Date(curr.dequeue_time).getTime() -
                new Date(curr.enqueue_time).getTime())
            );
          } else return acc;
        }, 0) / data.filter((row) => row.dequeue_time !== '').length
    );
  }, [data, timespan.end, timespan.start]);

  const avgEventsPerHour = useMemo(() => {
    return (
      eventsPerHourFiltered.reduce((acc, curr) => acc + curr.eventCount, 0) /
      eventsPerHourFiltered.length
    );
  }, [eventsPerHourFiltered]);

  const handleChangeTimespan: React.ChangeEventHandler<HTMLSelectElement> = (
    e,
  ) => {
    switch (e.target.value) {
      case 'View All':
        setTimespan({
          start: eventsPerHour[0].time,
          end: eventsPerHour[eventsPerHour.length - 1].time,
        });
        break;
      case 'Last Hour':
        setTimespan({
          start: eventsPerHour[eventsPerHour.length - 2].time,
          end: eventsPerHour[eventsPerHour.length - 1].time,
        });
        break;
      case 'Last 4 Hours':
        setTimespan({
          start: eventsPerHour[eventsPerHour.length - 5].time,
          end: eventsPerHour[eventsPerHour.length - 1].time,
        });
        break;
      default:
        setTimespan({
          start: eventsPerHour[0].time,
          end: eventsPerHour[eventsPerHour.length - 1].time,
        });
    }
  };

  return (
    <>
      <section className="hero is-primary">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">Events Management App</h1>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <header className="hero"></header>
          <main>
            <div className="tabs is-medium is-centered is-boxed">
              <ul>
                <li
                  className={activeTab === 'metrics' ? 'is-active' : ''}
                  onClick={() => setActiveTab('metrics')}
                >
                  <Link href="/#metrics" shallow>
                    Metrics
                  </Link>
                </li>
                <li
                  className={activeTab === 'data' ? 'is-active' : ''}
                  onClick={() => setActiveTab('data')}
                >
                  <Link href="/#data" shallow>
                    Data
                  </Link>
                </li>
                <li
                  className={activeTab === 'errors' ? 'is-active' : ''}
                  onClick={() => setActiveTab('errors')}
                >
                  <Link href="/#errors" shallow>
                    Errors
                  </Link>
                </li>
                <li
                  className={activeTab === 'logs' ? 'is-active' : ''}
                  onClick={() => setActiveTab('logs')}
                >
                  <Link href="/#logs" shallow>
                    Logs
                  </Link>
                </li>
              </ul>
            </div>
            {activeTab === 'metrics' ? (
              <>
                <div className="block">
                  <div className="select">
                    <select onChange={handleChangeTimespan}>
                      <option>View All</option>
                      <option>Last Hour</option>
                      <option>Last 4 Hours</option>
                    </select>
                  </div>
                </div>
                <div className="columns">
                  <div className="column is-four-fifths">
                    <div className="box">
                      <Line
                        options={{
                          scales: {
                            yAxes: [
                              {
                                ticks: {
                                  beginAtZero: true,
                                },
                              },
                            ],
                          },
                        }}
                        data={{
                          labels: eventsPerHourFiltered.map((row: any) =>
                            dayjs(row.time).format('MM/DD/YY h:mm A'),
                          ),
                          datasets: [
                            {
                              label: 'Number of Events',
                              backgroundColor: 'rgb(255, 99, 132)',
                              borderColor: 'rgb(255, 99, 132)',
                              data: eventsPerHourFiltered.map(
                                (row: any) => row.eventCount,
                              ),
                            },
                          ],
                        }}
                      />
                    </div>
                  </div>
                  <div className="column">
                    <div className="box level">
                      <div className="level-item has-text-centered ">
                        <div>
                          <p className="heading">Avg. Time in Queue</p>
                          <p className="title has-text-info">
                            {avgTimeInQueue.toFixed(2)}ms
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="box level">
                      <div className="level-item has-text-centered ">
                        <div>
                          <p className="heading">Avg. Events per Hour</p>
                          <p className="title has-text-info">
                            {avgEventsPerHour.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : activeTab === 'data' && data ? (
              <DataTable paginatedData={paginatedData} pageCount={pageCount} />
            ) : activeTab === 'logs' ? (
              <figure className="highlight has-text-white">
                <pre>
                  {logs.map((log) => (
                    <p key={log.timestamp}>
                      {log.timestamp}: {log.message}
                    </p>
                  ))}
                </pre>
              </figure>
            ) : (
              activeTab === 'errors' && (
                <figure className="highlight has-text-danger">
                  <pre>
                    {errors.map((error) => (
                      <p key={error.timestamp}>
                        {error.timestamp}: [{error.code}] {error.message}
                      </p>
                    ))}
                  </pre>
                </figure>
              )
            )}
          </main>
        </div>
      </section>
    </>
  );
};

export default App;
