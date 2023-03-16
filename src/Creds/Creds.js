import * as React from "react";
import { useEffect, useState } from "react";
import { addOrUpdateAction } from "../api/api";
import { Snackbar } from "@material-ui/core";
import "./Creds.css";
import Form from "../Form/Form";

const Creds = () => {
  const [loading, setLoading] = useState(false);
  const [snackBar, setSnackbar] = useState({
    state: false,
    message: "Creds updated successfully!",
  });
  useEffect(() => {});
  function handleCredsUpdate(creds) {
    setLoading(true);
    addOrUpdateAction(creds, "updateCreds")
      .then(() => {
        setLoading(false);
        setSnackbar({ ...snackBar, state: true });
      })
      .catch(() => {
        setSnackbar({ ...snackBar, message: "something went wrong..." });
      });
  }

  return (
    <div className="creds_container">
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackBar.state}
        onClose={() => setSnackbar({ ...snackBar, state: false })}
        message="Creds updated successfully!"
        key={"snackbar"}
        autoHideDuration={3000}
      />
      <Form
        data={[
          { id: "ssid", label: "SSID", type: 1, value: "" },
          { id: "password", label: "Password", type: 1, value: "" },
        ]}
        loading={loading}
        submitText={"Update"}
        submitHandler={(creds) => handleCredsUpdate(creds)}
        cleanAfterSubmit
      />
    </div>
  );
};
export default Creds;
