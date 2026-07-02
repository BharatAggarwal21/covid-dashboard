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
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://covid-api.com/api/reports/total")
      .then((res) => res.json())
      .then((data) => setGlobalData(data.data))
      .catch(() => setError("Couldn't load global stats. Please try again later."));

    fetch("https://covid-api.com/api/regions")
      .then((res) => res.json())
      .then((data) => {
        setCountries(data.data);
        setSelectedCountry(data.data[0]?.iso ?? null);
      })
      .catch(() => setError("Couldn't load country list. Please try again later."));
  }, []);

  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedCountryName = countries.find(
    (c) => c.iso === selectedCountry
  )?.name;

  return (
    <div className="wrapper">
      <Sidebar />
      <main className="main">
        <div className="container">
          <div className="summary-header">
            <h1 className="summary">Summary</h1>
            {globalData?.last_update && (
              <span className="as-of">
                Data as of{" "}
                {new Date(globalData.last_update).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
          {error && <div className="error-banner">{error}</div>}
          {globalData ? (
            <Summary global={globalData} />
          ) : (
            !error && <StatSkeleton />
          )}
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
            <div className="stats">
              <CovidChart
                selectedCountry={selectedCountry}
                countryName={selectedCountryName}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const StatSkeleton = () => (
  <div className="row">
    {[0, 1, 2, 3].map((i) => (
      <div className="col-3" key={i}>
        <div className="status-box skeleton" />
      </div>
    ))}
  </div>
);

export default App;
