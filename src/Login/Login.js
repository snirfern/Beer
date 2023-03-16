import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { getAuthApproval, initStore } from "../api/api";
import { CircularProgress } from "@material-ui/core";
import { useStore } from "../Store/Store";

const textFieldProps = {
  margin: "normal",
  required: true,
  fullWidth: true,
  name: "password",
  label: "Password",
  type: "password",
  id: "password",
  autoComplete: "current-password",
};
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Dr Sniro
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function Login() {
  const { dispatch } = useStore();

  const [loading, setLoading] = useState(false);
  const [creds, setCreds] = useState({ password: "" });
  async function submitHandler() {
    setLoading(true);
    getAuthApproval(creds).then((res) => {
      if (res > 0) {
        initStore().then((res) => {
          dispatch({ type: "INIT", payload: res });
        });
      } else {
        setLoading(false);
      }
    });
  }
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar src={"./beer.png"} sx={{ m: 1, bgcolor: "secondary.main" }} />

          <Box noValidate style={{ padding: "30px" }} sx={{ mt: 1 }}>
            <TextField
              {...textFieldProps}
              onChange={(e) => setCreds({ ...creds, password: e.target.value })}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              style={{ textTransform: "none", height: "40px" }}
              sx={{ mt: 3, mb: 2 }}
              onClick={() => submitHandler()}
            >
              {loading ? (
                <CircularProgress style={{ color: "white" }} size={"1.5em"} />
              ) : (
                "Sign In"
              )}
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
