import {
  Button,
  Dialog,
  DialogTitle,
  Stack
} from "@mui/material";
import { CaretLeft } from "@phosphor-icons/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleDialog, updatedContactInfo } from "../../redux/slices/App";
import Messages from "../converstation/Messages";


const SharedMsgs = () => {
  const dispatch = useDispatch();
  const { contactInfo } = useSelector((store: any) => store.app);
  //   console.log(contactInfo)

  return (
    <Dialog
      open={contactInfo.open}
      keepMounted
      onClose={() => {
        dispatch(toggleDialog());
      }}
      aria-describedby="alert-dialog-slide-description"
    >
      {/* ==> title <== */}
      <Stack
        direction={"row"}
        alignItems={"center"}
        p={2}
        // sx={{backgroundColor: "red"}}
        // justifyContent={"space-between"}
      >
        <Button
          onClick={() => {
            dispatch(updatedContactInfo("CONTACT"));
          }}
          startIcon={<CaretLeft />}
        ></Button>
        <DialogTitle sx={{ m: "0", p: "15px 0" }}>{"Starred"}</DialogTitle>
      </Stack>

      {/* ===> body <=== */}

      <Stack
        sx={{
          height: "800px",
          width: "600px",
          position: "relative",
          flexGrow: 1,
          overflowY: "scroll",
        }}
        p={3}
        spacing={3}
      >
        <Messages />
      </Stack>
    </Dialog>
  );
};

export default SharedMsgs;
