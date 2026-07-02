import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const COLORS = {
  confirmed: "#2a78d6",
  deaths: "#e34948",
};

// This API's daily archive runs 2020-01-22 -> 2023-03-09 with no range/batch
// endpoint, so we sample one point per month (plus the first and last day)
// and fetch them in parallel rather than pulling all ~1,150 days.
const DATA_START = "2020-01-22";
const DATA_END = "2023-03-09";

function getSampleDates() {
  const dates = [DATA_START];
  const cursor = new Date("2020-02-01T00:00:00Z");
  const end = new Date(`${DATA_END}T00:00:00Z`);
  while (cursor < end) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }
  dates.push(DATA_END);
  return dates;
}

const SAMPLE_DATES = getSampleDates();

// Deaths are usually 1-2 orders of magnitude smaller than confirmed cases,
// which flattens the deaths line to near-zero on a shared axis. Scale
// confirmed down by the nearest "nice" factor (1/2/5 x a power of ten) so
// both lines stay readable on one axis, per dataviz guidance against
// dual-axis charts. Tooltips always show the true, unscaled value.
function niceScaleFactor(ratio) {
  if (!isFinite(ratio) || ratio <= 1) return 1;
  const exponent = Math.floor(Math.log10(ratio));
  const base = 10 ** exponent;
  const fraction = ratio / base;
  let niceFraction;
  if (fraction < 1.5) niceFraction = 1;
  else if (fraction < 3.5) niceFraction = 2;
  else if (fraction < 7.5) niceFraction = 5;
  else niceFraction = 10;
  return niceFraction * base;
}

const options = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: "index", intersect: false },
  plugins: {
    legend: {
      position: "top",
      align: "end",
      labels: { usePointStyle: true, boxWidth: 8, color: "#52514e" },
    },
    tooltip: {
      backgroundColor: "#0b0b0b",
      titleColor: "#ffffff",
      bodyColor: "#ffffff",
      padding: 10,
      cornerRadius: 8,
      callbacks: {
        label: (ctx) => {
          const raw = ctx.dataset.rawData
            ? ctx.dataset.rawData[ctx.dataIndex]
            : ctx.parsed.y;
          return `${ctx.dataset.rawLabel ?? ctx.dataset.label}: ${raw.toLocaleString()}`;
        },
      },
    },
  },
  scales: {
    x: {
      ticks: { color: "#898781", maxTicksLimit: 10 },
      grid: { display: false },
    },
    y: {
      ticks: { color: "#898781", callback: (v) => v.toLocaleString() },
      grid: { color: "#e1e0d9" },
    },
  },
};

const CovidChart = ({ selectedCountry, countryName }) => {
  const [chartData, setChartData] = useState(null);
  const [scaleFactor, setScaleFactor] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedCountry) return;

    let cancelled = false;
    setChartData(null);
    setScaleFactor(1);
    setError(null);

    Promise.all(
      SAMPLE_DATES.map((date) =>
        fetch(
          `https://covid-api.com/api/reports/total?iso=${selectedCountry}&date=${date}`
        )
          .then((res) => res.json())
          .then((json) => {
            const point = Array.isArray(json.data) ? null : json.data;
            return {
              date,
              confirmed: point?.confirmed ?? 0,
              deaths: point?.deaths ?? 0,
            };
          })
      )
    )
      .then((points) => {
        if (cancelled) return;

        const confirmedRaw = points.map((p) => p.confirmed);
        const deathsRaw = points.map((p) => p.deaths);
        const maxConfirmed = Math.max(...confirmedRaw);
        const maxDeaths = Math.max(...deathsRaw);
        const factor =
          maxDeaths > 0 ? niceScaleFactor(maxConfirmed / maxDeaths) : 1;

        setScaleFactor(factor);
        setChartData({
          labels: points.map((p) =>
            new Date(p.date).toLocaleDateString(undefined, {
              month: "short",
              year: "2-digit",
            })
          ),
          datasets: [
            {
              label:
                factor > 1 ? `Confirmed (÷${factor.toLocaleString()})` : "Confirmed",
              rawLabel: "Confirmed",
              data: factor > 1 ? confirmedRaw.map((v) => v / factor) : confirmedRaw,
              rawData: confirmedRaw,
              borderColor: COLORS.confirmed,
              backgroundColor: COLORS.confirmed,
              borderWidth: 2,
              pointRadius: 0,
              pointHoverRadius: 4,
              tension: 0.25,
            },
            {
              label: "Deaths",
              data: deathsRaw,
              rawData: deathsRaw,
              borderColor: COLORS.deaths,
              backgroundColor: COLORS.deaths,
              borderWidth: 2,
              pointRadius: 0,
              pointHoverRadius: 4,
              tension: 0.25,
            },
          ],
        });
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load the trend for this country.");
      });

    return () => {
      cancelled = true;
    };
  }, [selectedCountry]);

  return (
    <div className="chart-wrapper">
      {countryName && (
        <div className="chart-header">
          <h2 className="chart-title">{countryName}</h2>
          <span className="chart-asof">
            Monthly trend, Jan 2020 – Mar 2023 (source stopped updating)
          </span>
        </div>
      )}
      {scaleFactor > 1 && (
        <div className="scale-note">
          <span className="scale-note-icon">⚠</span>
          <strong>Confirmed is scaled ÷{scaleFactor.toLocaleString()}</strong> so
          Deaths stays visible on the same axis — hover any point for the real,
          unscaled value.
        </div>
      )}
      {error && <div className="error-banner">{error}</div>}
      {!error && !chartData && (
        <div className="chart-loading">
          <span className="spinner" />
        </div>
      )}
      {chartData && (
        <div className="chart-canvas">
          <Line data={chartData} options={options} />
        </div>
      )}
    </div>
  );
};

export default CovidChart;
