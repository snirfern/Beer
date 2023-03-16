import React, { createContext, useContext, useReducer } from "react";

const initialState = {
  networkError: false,
  didInit: false,
  auth: false,
  loading: true,

  charts: [],
  liveData: [],
  recipes: [],
  statistics: {},
  instructions: [],
};

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "INIT": {
      const { statistics, recipes, instructions } = payload;
      return {
        ...state,
        recipes: recipes ?? [],
        statistics: statistics[0]?.report ?? {},
        instructions: instructions ?? [],
        loading: false,
        didInit: true,
      };
    }
    case "SET_LIVE_DATA": {
      if (payload.length === 0) {
        return { ...state };
      }
      const newLiveData = [...state.liveData];
      const dict = {};
      state.liveData.forEach((item) => {
        if (!dict[item.timestamp]) {
          dict[item.timestamp] = 1;
        }
      });
      payload
        .filter(
          (cD) => cD?.date && cD?.temperature && cD?.alcohol && cD?.timestamp
        )
        .forEach((item) => {
          if (!dict[item.timestamp]) {
            newLiveData.push(item);
          }
        });
      return {
        ...state,
        liveData: newLiveData.sort((x, y) => {
          return y.timestamp.toString().localeCompare(x.timestamp.toString());
        }),
      };
    }
    case "CLEAN_LIVE_DATA": {
      return { ...state, liveData: [] };
    }
    case "LOADING": {
      return { ...state, loading: payload };
    }

    case "REMOVE_ACTION": {
      const { id, key } = payload;
      return {
        ...state,
        [key]: [...state[key]].filter((cR) => cR.id !== id),
      };
    }
    case "ADD_ACTION": {
      const { key, item } = payload;
      return { ...state, [key]: [...state[key], item] };
    }
    case "UPDATE_ACTION": {
      const { key, item } = payload;

      const updatedItems = [...state[key]];
      const newItemIndex = updatedItems.findIndex((r) => r.id === item.id);
      updatedItems.splice(newItemIndex, 1, item);
      return {
        ...state,
        [key]: updatedItems,
      };
    }

    case "MONGO/NETWORK_ERROR": {
      return { ...state, networkError: true };
    }
    default: {
      return { ...state };
    }
  }
};

const StoreContext = createContext(undefined);

const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    reducer,
    initialState,
    () => initialState
  );

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};
const useStore = () => useContext(StoreContext);

export { StoreProvider, useStore };
