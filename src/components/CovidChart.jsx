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

const CovidChart = ({ selectedCountry }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (!selectedCountry) return;

    // Fetch country reports
    fetch(`https://covid-api.com/api/reports?iso=${selectedCountry}`)
      .then((res) => res.json())
      .then((data) => {
        const reports = data.data;

        // Example: sort by date ascending
        reports.sort((a, b) => new Date(a.date) - new Date(b.date));

        const labels = reports.map((r) => r.date);
        const confirmed = reports.map((r) => r.confirmed);
        const recovered = reports.map((r) => r.recovered);
        const deaths = reports.map((r) => r.deaths);

        setChartData({
          labels,
          datasets: [
            {
              label: "Confirmed",
              data: confirmed,
              borderColor: "red",
              fill: false,
            },
            {
              label: "Recovered",
              data: recovered,
              borderColor: "green",
              fill: false,
            },
            {
              label: "Deaths",
              data: deaths,
              borderColor: "black",
              fill: false,
            },
          ],
        });
      });
  }, [selectedCountry]);

  return <Line data={chartData} />;
};

export default CovidChart;
