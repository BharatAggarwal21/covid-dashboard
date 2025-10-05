import React from "react";

const Sidebar = () => (
  <div className="sidebar">
    <div className="logo-container">
      <img src="/covid.jpeg" alt="." className="covid-icon" />
      <div className="logo">COVID</div>
    </div>
    <nav className="nav">
      <ul>
        <li>
          <a href="/" className="navlink">
            Overview
          </a>
        </li>
        <li>
          <a href="https://www.who.int/" className="navlink">
            WHO
          </a>
        </li>
        <li>
          <a href="https://www.cdc.gov/" className="navlink">
            Contact Us
          </a>
        </li>
      </ul>
    </nav>
  </div>
);

export default Sidebar;
