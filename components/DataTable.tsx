import React, { useState } from "react";

import type { QueueMetrics } from "../types";

type DataTableProps = {
  paginatedData: Record<number, QueueMetrics[]>;
  pageCount: number;
};

const DataTable: React.FC<DataTableProps> = ({ paginatedData, pageCount }) => {
  const [page, setPage] = useState(1);

  return (
    <div className="table-container">
      <table className="table is-fullwidth">
        <thead>
          <tr>
            <th>Queue</th>
            <th>Id</th>
            <th>Event Type</th>
            <th>Enqueue Time</th>
            <th>Dequeue Time</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData[page].map((row) => (
            <tr key={row.replay_id}>
              <td>queue_1</td>
              <td>{row.replay_id}</td>
              <td>{row.event_type}</td>
              <td>{row.enqueue_time}</td>
              <td>{row.dequeue_time || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <nav
        className="pagination is-centered"
        role="navigation"
        aria-label="pagination"
      >
        <button
          className="button pagination-previous"
          disabled={page <= 1}
          onClick={() => setPage((page) => page - 1)}
        >
          Previous
        </button>
        <button
          className="button pagination-next"
          disabled={page >= pageCount}
          onClick={() => setPage((page) => page + 1)}
        >
          Next page
        </button>
        <ul className="pagination-list">
          <li>
            <button
              className={`button pagination-link ${page === 1 && "is-current"}`}
              onClick={() => setPage(1)}
            >
              1
            </button>
          </li>
          {page <= 3 && (
            <>
              <li>
                <button
                  className={`button pagination-link ${
                    page === 2 && "is-current"
                  }`}
                  onClick={() => setPage(2)}
                >
                  2
                </button>
              </li>
              <li>
                <button
                  className={`button pagination-link ${
                    page === 3 && "is-current"
                  }`}
                  onClick={() => setPage(3)}
                >
                  3
                </button>
              </li>
              <li>
                <button
                  className={`button pagination-link ${
                    page === 4 && "is-current"
                  }`}
                  onClick={() => setPage(4)}
                >
                  4
                </button>
              </li>
            </>
          )}
          {page > 3 && (
            <li>
              <span className="pagination-ellipsis">&hellip;</span>
            </li>
          )}
          {page < pageCount - 1 && page > 3 && (
            <>
              <li>
                <button
                  className="button pagination-link"
                  onClick={() => setPage((page) => page - 1)}
                >
                  {page - 1}
                </button>
              </li>
              <li>
                <button className="button pagination-link is-current">
                  {page}
                </button>
              </li>
              <li>
                <button
                  className="button pagination-link"
                  onClick={() => setPage((page) => page + 1)}
                >
                  {page + 1}
                </button>
              </li>
            </>
          )}
          {page < pageCount - 2 && (
            <li>
              <span className="pagination-ellipsis">&hellip;</span>
            </li>
          )}
          {page >= pageCount - 2 && (
            <>
              <li>
                <button
                  className={`button pagination-link ${
                    page === pageCount - 3 && "is-current"
                  }`}
                  onClick={() => setPage(pageCount - 3)}
                >
                  {pageCount - 3}
                </button>
              </li>
              <li>
                <button
                  className={`button pagination-link ${
                    page === pageCount - 2 && "is-current"
                  }`}
                  onClick={() => setPage(pageCount - 2)}
                >
                  {pageCount - 2}
                </button>
              </li>
              <li>
                <button
                  className={`button pagination-link ${
                    page === pageCount - 1 && "is-current"
                  }`}
                  onClick={() => setPage(pageCount - 1)}
                >
                  {pageCount - 1}
                </button>
              </li>
            </>
          )}
          <li>
            <button
              className={`button pagination-link ${
                page === pageCount && "is-current"
              }`}
              onClick={() => setPage(pageCount)}
            >
              {pageCount}
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default DataTable;
