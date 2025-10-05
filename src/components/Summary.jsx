import React from "react";

const Summary = ({ global }) => (
  <div className="global-status">
    <div className="row">
      <div className="col-3">
        <div className="status-box">
          <h3>Total Confirmed</h3>
          <h3 className="total">{global.confirmed}</h3>
          <p>World Wide</p>
        </div>
      </div>
      <div className="col-3">
        <div className="status-box">
          <h3>Active Cases</h3>
          <h3 className="active-cases">{global.active}</h3>
          <p>World Wide</p>
        </div>
      </div>
      <div className="col-3">
        <div className="status-box">
          <h3>Recovered</h3>
          <h3 className="recoverd">{global.recovered}</h3>
          <p>World Wide</p>
        </div>
      </div>
      <div className="col-3">
        <div className="status-box">
          <h3>Deaths</h3>
          <h3 className="death">{global.deaths}</h3>
          <p>World Wide</p>
        </div>
      </div>
    </div>
  </div>
);

export default Summary;
