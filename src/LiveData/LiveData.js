import { CircularProgress, ListItem, ListItemText } from "@material-ui/core";
import List from "@mui/material/List";
import * as React from "react";
import { useEffect, useState } from "react";
import { getMeasurements } from "../api/api";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import Button from "@mui/material/Button";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import { useStore } from "../Store/Store";
import "./LiveData.css";
import { beautifyDate, getMs } from "../Utils/Utils";
import { Chart } from "../Chart/Chart";

let interval = undefined;
const iconStyle = {
  position: "fixed",
  bottom: "5px",
  right: "10px",

  zIndex: 23232,
  color: "purple",
};
const listStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};
const listItemStyle = { display: "flex", justifyContent: "space-between" };

function getDataAsChart(measurements) {
  if (measurements.length === 0) {
    return { chartValues: [], alcoholAverage: 0, temperatureAverage: 0 };
  }
  const arr = measurements.map((m) => [
    new Date(m.date),
    Number(m.temperature.toFixed(2)),
    Number(m.alcohol.toFixed(2)),
  ]);

  arr.sort((x, y) => x[0] - y[0]);
  const alcoholAverage = measurements.reduce(
    (sum, item) => sum + Number(item.alcohol),
    0
  );
  const temperatureAverage = measurements.reduce(
    (sum, item) => sum + Number(item.temperature),
    0
  );
  return {
    chartValues: [...arr],
    alcoholAverage: (alcoholAverage / measurements.length).toFixed(2),
    temperatureAverage: (temperatureAverage / measurements.length).toFixed(2),
  };
}

const LiveData = () => {
  const { state, dispatch } = useStore();
  const { liveData } = state;
  const [chartMode, setChartMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const { chartValues, alcoholAverage, temperatureAverage } =
    getDataAsChart(liveData);

  function modeHandler() {
    if (!chartMode) {
      setLoading(true);
    }
    setChartMode(!chartMode);
  }

  function getMeasurementsCaller() {
    setLoading(true);
    const lastRecordDate = (new Date().valueOf() - getMs(1)).toString();
    const filter = {
      timestamp: {
        $gte: lastRecordDate,
      },
    };
    getMeasurements({
      dispatch: dispatch,
      filter: filter,
    }).then(() => {
      setLoading(false);
      interval = setInterval(
        () => {
          getMeasurements({
            dispatch: dispatch,
            filter: filter,
          }).then(() => {});
        },
        15000,
        lastRecordDate
      );
    });
  }

  useEffect(() => {
    getMeasurementsCaller();
    return () => {
      clearInterval(interval);
      dispatch({ type: "CLEAN_LIVE_DATA" });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  if (liveData.length === 0) {
    return (
      <div style={{ padding: 10 }}>
        {loading ? (
          <CircularProgress style={{ margin: "25px" }} />
        ) : (
          <div className="no_data_to_show">No data to show... </div>
        )}
      </div>
    );
  }
  return (
    <>
      {!chartMode && (
        <DeleteTwoToneIcon
          style={iconStyle}
          onClick={() => dispatch({ type: "CLEAN_LIVE_DATA" })}
        />
      )}
      <Button
        style={{
          minHeight: 36,
          minWidth: "200px",
          margin: 20,
          background: "#3f51b5",
        }}
        onClick={() => modeHandler()}
      >
        {!chartMode && <div className="loader" />}
        {chartMode && (
          <AssessmentOutlinedIcon
            style={{ color: "white", padding: "10x" }}
            className={"pulse"}
          />
        )}
      </Button>
      {!chartMode && (
        <List style={listStyle}>
          {liveData.length > 0 &&
            liveData.slice(liveData, 10).map((measurement, index) => (
              <div
                className="live_data_row_container"
                key={`live_data_row_container_${index}`}
              >
                <div className="live_data_date" key={`livedata_m_${index}`}>
                  {beautifyDate(new Date(measurement.date)) ?? ""}
                </div>
                <ListItem key={`measurement_${index}`} style={listItemStyle}>
                  <ListItemText
                    style={{ width: "50%" }}
                    primary="Temperature"
                    secondary={`${measurement.temperature.toFixed(2)}C`}
                  />
                  <ListItemText
                    primary="Alcohol"
                    secondary={`${measurement.alcohol.toFixed(2)}%`}
                  />
                </ListItem>
              </div>
            ))}
        </List>
      )}
      {chartMode && (
        <div
          className="live_chart_mother_container"
          style={{ opacity: loading ? 0 : 1 }}
        >
          <div className="live_data_chart_container">
            <Chart
              data={chartValues}
              chartType={"AreaChart"}
              loading={loading}
              setLoading={setLoading}
            />
          </div>

          <div className="live_data_chart_summary">
            <div className="live_data_average_container">
              <span style={{ color: "red" }}>Alcohol</span>
              {` ~  ${alcoholAverage} %`}
            </div>
            <div className="live_data_average_container">
              <span style={{ color: "#4674d1" }}>Temperature</span>
              {` ~  ${temperatureAverage} C`}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LiveData;
