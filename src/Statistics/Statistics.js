import "./Statistics.css";
import * as React from "react";
import { useMemo, useState } from "react";
import { useStore } from "../Store/Store";
import { CircularProgress } from "@material-ui/core";
import { Chart } from "../Chart/Chart";

const Statistics = () => {
  const { state } = useStore();
  const { statistics } = state;
  const [loading, setLoading] = useState(true);

  const charts = useMemo(
    () =>
      Object.keys(statistics ?? {}).map((key) => {
        const data = statistics[key].map((m) => {
          const date = new Date();
          date.setHours(m.hour);
          date.setMinutes(0, 0, 0);
          return [
            date,
            Number(m.temperature.toFixed(2)),
            Number(m.alcohol.toFixed(2)),
          ];
        });
        data.sort((x, y) => x[0] - y[0]);
        return {
          date: key.split("-").reverse().join("-"),
          data: data,
        };
      }),
    [statistics]
  );

  charts.sort((a, b) => b.date.localeCompare(a.date));

  if (charts.length === 0) {
    return <div style={{ padding: 20 }}>No data...</div>;
  }
  return (
    <div className="charts_container">
      {loading && (
        <CircularProgress
          color={"primary"}
          size={"2em"}
          style={{ margin: "25px" }}
        />
      )}
      <div className="charts" style={{ opacity: loading ? 0 : 1 }}>
        {charts.length > 0 &&
          charts.map((chart, index) => (
            <div className="single_chart_container" key={`chart_${index}`}>
              <div className="chart_container">
                <div className="statistics_chart_date_container">
                  {chart.date}
                </div>
                <Chart
                  chartDate={chart.date}
                  data={chart.data}
                  chartType={"AreaChart"}
                  loading={loading}
                  setLoading={setLoading}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Statistics;
