import React, { useState } from "react";
import { Bar } from "@reactchartjs/react-chart.js";

// Styles
import "./styles.scss";
import "@fortawesome/fontawesome-free/css/all.css";
import useSWR from "swr";

type QueueMetrics = {
  name: string;
  queueId: number;
  aveEventsInOutPerHour: number;
  aveTimeInQueue: string;
  logs: {
    created: string;
    eventId: number;
    level: string;
    message: string;
  }[];
  errors: {
    time: string;
    eventId: number;
    errorCode: number;
    errorLog: string;
  }[];
};

const options = {
  scales: {
    yAxes: [
      {
        position: "left",
        id: "y-axis-1",
        ticks: {
          beginAtZero: true,
        },
      },
      {
        position: "right",
        id: "y-axis-2",
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

const fetcher = async (input: RequestInfo, init: RequestInit) =>
  (await fetch(input, { ...init })).json();

const stringToSeconds = (string: string) => {
  const parts = string.split(":");
  const hours = parseInt(parts[0]);
  const min = parseInt(parts[1]);
  const sec = parseInt(parts[2]);
  return hours * 360 + min * 60 + sec;
};

const formatData = (data: QueueMetrics) => ({
  labels: [data.name],
  datasets: [
    {
      label: "Average Events In/Out per Hour",
      data: [data.aveEventsInOutPerHour],
      backgroundColor: "rgb(255, 99, 132)",
      yAxisID: "y-axis-1",
    },
    {
      label: "Average Time in Queue (seconds)",
      data: [stringToSeconds(data.aveTimeInQueue)],
      backgroundColor: "rgb(54, 162, 235)",
      yAxisID: "y-axis-2",
    },
  ],
});

const App = () => {
  const [activeTab, setActiveTab] = useState<
    "metrics" | "data" | "errors" | "logs"
  >("metrics");
  const { data, error } = useSWR<QueueMetrics>(
    "https://app-event-management.herokuapp.com/queueMetrics",
    fetcher
  );

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
            <div className="tabs is-large is-centered is-boxed">
              <ul>
                <li className={activeTab === "metrics" ? "is-active" : ""}>
                  <a onClick={() => setActiveTab("metrics")}>Metrics</a>
                </li>
                <li className={activeTab === "data" ? "is-active" : ""}>
                  <a onClick={() => setActiveTab("data")}>Data</a>
                </li>
                <li className={activeTab === "errors" ? "is-active" : ""}>
                  <a onClick={() => setActiveTab("errors")}>Errors</a>
                </li>
                <li className={activeTab === "logs" ? "is-active" : ""}>
                  <a onClick={() => setActiveTab("logs")}>Logs</a>
                </li>
              </ul>
            </div>
            {activeTab === "metrics" ? (
              <div className="field">
                <div className="control">
                  <div className="select is-primary">
                    <select>
                      <option>Select Queue</option>
                    </select>
                  </div>
                </div>
                <Bar
                  data={data && formatData(data)}
                  options={options}
                  type="bar"
                />
              </div>
            ) : activeTab === "data" ? (
              <table className="table is-fullwidth">
                <thead>
                  <tr>
                    <th>Queue</th>
                    <th>Id</th>
                    <th>Ave. Events In/Out per Hour</th>
                    <th>Ave. Time in Queue</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{data?.name}</td>
                    <td>{data?.queueId}</td>
                    <td>{data?.aveEventsInOutPerHour}</td>
                    <td>{data?.aveTimeInQueue}</td>
                  </tr>
                </tbody>
              </table>
            ) : activeTab === "logs" ? (
              <figure className="highlight has-text-white">
                <pre>
                  {data?.logs.map((log) => (
                    <p>
                      {log.created}: [{log.level}] EventId: {log.eventId} -{" "}
                      {log.message}
                    </p>
                  ))}
                </pre>
              </figure>
            ) : (
              activeTab === "errors" && (
                <figure className="highlight has-text-danger">
                  <pre>
                    {data?.errors.map((error) => (
                      <p>
                        {error.time}: EventId: {error.eventId} -{" "}
                        {error.errorCode ? `${error.errorCode} ` : ""}
                        {error.errorLog}
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
