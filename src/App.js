import "./App.css";
import IconTabs from "./Tabs/Tabs";
import Recipes from "./Recipes/Recipes";
import LiveData from "./LiveData/LiveData";
import Creds from "./Creds/Creds";
import * as React from "react";
import { useEffect, useState } from "react";
import Login from "./Login/Login";
import { useStore } from "./Store/Store";
import { initStore } from "./api/api";
import { CircularProgress } from "@material-ui/core";
import Statistics from "./Statistics/Statistics";
import Instructions from "./Instructions/Instructions";
import ErrorBoundary, { NetworkError } from "./ErrorsCatcher/ErrorBoundary";

function App() {
  const { dispatch, state } = useStore();
  const [selectedItem, setSelectedItem] = useState("Statistics");
  const [pageContentLoaded, setPageContentLoaded] = useState();

  useEffect(() => {
    Promise.all(
      Array.from(document.images).map((img) => {
        return new Promise((resolve) => {
          img.addEventListener("load", () => resolve());
        });
      })
    ).then(() => {
      setPageContentLoaded(false);
    });
  }, [selectedItem]);

  if (!window.localStorage.getItem("creds") && !state.auth) {
    return <Login />;
  }

  if (!state.didInit) {
    initStore().then((res) => {
      if (!res?.statistics || typeof res?.statistics === "string") {
        dispatch({ type: "MONGO/NETWORK_ERROR", payload: res });
        return;
      }

      dispatch({ type: "INIT", payload: res });
    });
  }

  if (state.networkError) {
    return <NetworkError />;
  }
  return (
    <div className="App">
      <IconTabs setSelectedItem={setSelectedItem} />
      {(state.loading || pageContentLoaded) && (
        <CircularProgress style={{ margin: "25px" }} />
      )}

      {!state.loading && (
        <div className="body_container">
          <ErrorBoundary
            key={`error_boundary_key`}
            errorType={selectedItem.toLowerCase()}
          >
            {selectedItem === "Recipes" && <Recipes />}
            {selectedItem === "Live data" && <LiveData />}
            {selectedItem === "Statistics" && <Statistics />}
            {selectedItem === "Wifi" && <Creds />}
            {selectedItem === "Instructions" && <Instructions />}
          </ErrorBoundary>
        </div>
      )}
    </div>
  );
}

export default App;
