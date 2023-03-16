import axios from "axios";
import { buildImageForm } from "../Utils/Utils";

export const initStore = async () => {
  const res = await fetch(
    process.env.REACT_APP_BACKEND,
    Config({ action: "init", filter: {} })
  ).catch((e) => {
    console.log(e);
    return {};
  });
  return res.json();
};
export const getAuthApproval = async (creds) => {
  const res = await fetch(
    process.env.REACT_APP_BACKEND,
    Config({
      action: "getAuthApproval",
      payload: creds.password.toString(),
    })
  );
  window.localStorage.setItem("creds", "yesh");
  window.localStorage.removeItem("tab");
  return await res.json();
};

export const addOrUpdateAction = async (item, action) => {
  return await fetch(
    process.env.REACT_APP_BACKEND,
    Config({
      action: action,
      filter: {},
      payload: item,
    })
  )
    .catch(() => -1)
    .finally(() => 1);
};

export const removeAction = async (item, action) => {
  return await fetch(
    process.env.REACT_APP_BACKEND,
    Config({
      action: action,
      filter: {},
      payload: { id: item.id },
    })
  ).then(() => {});
};

export const getMeasurements = async ({ dispatch, filter }) => {
  const res = await fetch(
    process.env.REACT_APP_BACKEND,
    Config({ action: "getMeasurements", filter: filter ?? {} })
  );
  const jsoned = await res.json();
  dispatch({ type: "SET_LIVE_DATA", payload: jsoned["documents"] });
};
export const uploadImage = async (imageFile) => {
  const formData = buildImageForm(imageFile);
  return axios
    .post(process.env.REACT_APP_CLOUDINARY_URL, formData)
    .then((result) => {
      console.log(result.data.url);
      return result.data.url;
    })
    .catch((err) => {
      console.log(err);
      return "./default_beer.png";
    });
};
const Config = ({ action, filter, payload }) => {
  const body = {
    action: action,
    filter: filter ?? {},
  };
  if (payload) {
    body.payload = payload;
  }

  return {
    redirect: "follow",
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "text/plain;charset=utf-8" },
  };
};
