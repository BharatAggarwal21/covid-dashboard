import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Summary from "./components/Summary";
import CountryList from "./components/CountryList";
import CovidChart from "./components/CovidChart";
import "./index.css";

function App() {
  const [globalData, setGlobalData] = useState(null);
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    // Fetch global & country data
    fetch("https://covid-api.com/api/reports/total")
      .then((res) => res.json())
      .then((data) => setGlobalData(data.data));

    fetch("https://covid-api.com/api/regions")
      .then((res) => res.json())
      .then((data) => {
        setCountries(data.data);
        setSelectedCountry(data.data[0].iso);
      });
  }, []);

  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="wrapper">
      <Sidebar />
      <main className="main">
        <div className="container">
          <h1 className="summary">Summary</h1>
          {globalData && <Summary global={globalData} />}
          <div className="map-container">
            <aside className="country">
              <input
                type="text"
                id="searchByCountry"
                placeholder="Search Country"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <CountryList
                countries={filteredCountries}
                onSelectCountry={setSelectedCountry}
                selectedCountry={selectedCountry}
              />
            </aside>
            <CovidChart selectedCountry={selectedCountry} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
