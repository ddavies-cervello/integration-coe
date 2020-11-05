import React, { useState } from "react";
import { Bar } from "@reactchartjs/react-chart.js";

// Styles
import "bulma/css/bulma.min.css";
import "@fortawesome/fontawesome-free/css/all.css";

const data = {
  labels: ["1", "2", "3", "4", "5", "6"],
  datasets: [
    {
      label: "# of Red Votes",
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: "rgb(255, 99, 132)",
    },
    {
      label: "# of Blue Votes",
      data: [2, 3, 20, 5, 1, 4],
      backgroundColor: "rgb(54, 162, 235)",
    },
    {
      label: "# of Green Votes",
      data: [3, 10, 13, 15, 22, 30],
      backgroundColor: "rgb(75, 192, 192)",
    },
  ],
};

const options = {
  scales: {
    yAxes: [
      {
        stacked: true,
        ticks: {
          beginAtZero: true,
        },
      },
    ],
    xAxes: [
      {
        stacked: true,
      },
    ],
  },
};

const App = () => {
  const [activeTab, setActiveTab] = useState<
    "metrics" | "data" | "errors" | "logs"
  >("metrics");
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
            <div className="field">
              <div className="control">
                <div className="select is-primary">
                  <select>
                    <option>Select Queue</option>
                  </select>
                </div>
              </div>
              <Bar data={data} options={options} type="bar" />
            </div>
          </main>
        </div>
      </section>
    </>
  );
};

export default App;
