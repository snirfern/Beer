import React, { useEffect } from "react";
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
import "./Chart.css";
import { Line } from "react-chartjs-2";
import { beautifyDate } from "../Utils/Utils";
import { Filler } from "chart.js";
import CrosshairPlugin from "chartjs-plugin-crosshair";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
ChartJS.register(CrosshairPlugin);

ChartJS.register(Filler);

function buildOptions(data) {
  return {
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          callback: function (label, index) {
            if (index === 0 || index === data.length - 1) {
              return beautifyDate(data[index][0]);
            }
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      crosshair: {
        line: {
          color: "grey",
          width: 1,
          dashPattern: [2, 2],
        },
      },
      tooltip: {
        mode: "index", // this mode launches single tooltip for both series
        padding: 20,
        position: "average",
        events: ["touchstart", "touchmove"],
      },
      legend: {
        position: "bottom",
      },
      responsive: true,
      events: ["touchstart", "touchmove"],
    },
  };
}

function buildData(data) {
  return {
    labels: data.map((dat) => beautifyDate(dat[0])),
    datasets: [
      {
        fill: true,
        label: "Temperature",
        data: [...data.map((dat) => dat[1])],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderWidth: 1,
        pointRadius: 2,
        pointHitRadius: 20,
      },
      {
        label: "Alcohol",
        fill: false,
        data: data.map((dat) => dat[2]),
        borderColor: "rgb(53, 162, 235)",
        borderWidth: 1,
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        pointRadius: 2,
        pointHitRadius: 20,
      },
    ],
  };
}

export function Chart({ data, setLoading, chartDate }) {
  const builtData = buildData(data);
  const builtOptions = buildOptions(data, chartDate);
  useEffect(() => {
    setLoading(false);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="chart_container_js">
      <Line options={builtOptions} data={builtData} type={"Line"} />
    </div>
  );
}
