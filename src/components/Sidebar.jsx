import React from "react";

const Sidebar = () => (
  <div className="sidebar">
    <div className="logo-container">
      <span className="logo-dot" />
      <div className="logo">COVID_19</div>
    </div>
    <nav className="nav">
      <ul>
        <li>
          <a href="/" className="navlink active">
            Overview
          </a>
        </li>
        <li>
          <a
            href="https://www.who.int/"
            className="navlink"
            target="_blank"
            rel="noreferrer"
          >
            WHO
          </a>
        </li>
        <li>
          <a
            href="https://www.cdc.gov/"
            className="navlink"
            target="_blank"
            rel="noreferrer"
          >
            Contact Us
          </a>
        </li>
      </ul>
    </nav>
  </div>
);

export default Sidebar;
