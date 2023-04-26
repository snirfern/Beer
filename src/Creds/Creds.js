import * as React from "react";
import {useEffect, useState} from "react";
import {addOrUpdateAction} from "../api/api";
import {Snackbar} from "@material-ui/core";
import "./Creds.css";
import Form from "../Form/Form";

const Creds = () => {
    const [snackBar, setSnackbar] = useState({
        state: false,
        message: "Creds updated successfully!",
    });
    useEffect(() => {
    });

    async function handleCredsUpdate(creds) {
        return addOrUpdateAction(creds, "updateCreds")
            .then(() =>
                setSnackbar({...snackBar, state: true})
            )
            .catch(() =>
                setSnackbar({...snackBar, message: "something went wrong..."})
            );
    }

    return (
        <div className="creds_container">
            <Snackbar
                anchorOrigin={{vertical: "bottom", horizontal: "center"}}
                open={snackBar.state}
                onClose={() => setSnackbar({...snackBar, state: false})}
                message="Creds updated successfully!"
                key={"snackbar"}
                autoHideDuration={3000}
            />
            <Form
                data={[
                    {id: "ssid", label: "SSID", type: 1, value: ""},
                    {id: "password", label: "Password", type: 1, value: ""},
                ]}
                submitText={"Update"}
                submitHandler={async (creds) => await handleCredsUpdate(creds)}
                cleanAfterSubmit
            />
        </div>
    );
};
export default Creds;
