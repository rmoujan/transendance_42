import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import { closeSnackBar } from "./redux/slices/contact";
import { useAppDispatch, useAppSelector } from "./redux/store/store";
import { FetchProfile } from "./redux/slices/profile";
import { FetchFriends } from "./redux/slices/app";
import { FetchChannels, FetchProtectedChannels, FetchPublicChannels } from "./redux/slices/channels";

const vertical = "top";
const horizontal = "center";

const Alert = React.forwardRef((props: any, ref: any) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

function App() {
  const { severity, message, open } = useAppSelector(
    state => state.contact.snackbar
  );
  const dispatch = useAppDispatch();
  // dispatch(FetchFriends());
  // dispatch(FetchChannels());
  // dispatch(FetchProtectedChannels());
  // dispatch(FetchPublicChannels());

  return (
    <div>
      <BrowserRouter>
        <Home />
      </BrowserRouter>
      {message && open ? (
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          autoHideDuration={4000}
          key={vertical + horizontal}
          onClose={() => {
            dispatch(closeSnackBar());
          }}
        >
          <Alert
            onClose={() => {
              dispatch(closeSnackBar());
            }}
            severity={severity}
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
      ) : (
        <></>
      )}
    </div>
  );
}

export default App;
