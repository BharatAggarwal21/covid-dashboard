import React from "react";

const fmt = (n) => (typeof n === "number" ? n.toLocaleString() : n);

const stats = [
  { key: "confirmed", label: "Total Confirmed", tone: "confirmed" },
  { key: "active", label: "Active Cases", tone: "active" },
  { key: "recovered", label: "Recovered", tone: "recovered" },
  { key: "deaths", label: "Deaths", tone: "deaths" },
];

const Summary = ({ global }) => (
  <div className="global-status">
    <div className="row">
      {stats.map(({ key, label, tone }) => (
        <div className="col-3" key={key}>
          <div className={`status-box tone-${tone}`}>
            <h3 className="status-label">
              <span className="status-dot" />
              {label}
            </h3>
            <h3 className="status-value">{fmt(global[key])}</h3>
            <p>{key === "recovered" && !global[key] ? "Not tracked by source" : "World Wide"}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Summary;
