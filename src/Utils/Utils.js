const timeZone = { timeZone: "Asia/Jerusalem" };

const beautifyDate = (date) => {
  try {
    return date
      .toLocaleTimeString("he-IL", timeZone)
      .replace(/[A-Za-z]/g, "")
      .trim();
  } catch (e) {
    console.log(e);
    return null;
  }
};

const getMs = (minutes) => 60000 * minutes;

const buildImageForm = (imageFile) => {
  const formData = new FormData();
  formData.append("api_key", process.env.REACT_APP_CLOUDINARY_API_KEY);
  formData.append("file", imageFile);
  formData.append(
    "public_id",
    imageFile.name.substr(0, imageFile.name.lastIndexOf("."))
  );
  formData.append("timestamp", new Date().valueOf().toString());
  formData.append("upload_preset", "ml_default");
  formData.append("width", "300");
  formData.append("height", "300");
  return formData;
};

const getDispatchAction = (mode, className) => {
  const dispatchType = `${mode ? "UPDATE" : "ADD"}_ACTION`;
  const action = mode ? `update${className}` : `add${className}`;
  return [dispatchType, action];
};
export { beautifyDate, getMs, buildImageForm, getDispatchAction };
