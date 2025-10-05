import React from "react";

const CountryList = ({ countries, onSelectCountry, selectedCountry }) => (
  <div className="country-list">
    <ul>
      {countries.length > 0 ? (
        countries.map((c) => (
          <li
            key={c.iso}
            className={`country-data ${
              selectedCountry === c.iso ? "active" : ""
            }`}
            onClick={() => onSelectCountry(c.iso)}
          >
            {c.name}
          </li>
        ))
      ) : (
        <li>
          <h2>No data for this country</h2>
        </li>
      )}
    </ul>
  </div>
);

export default CountryList;
