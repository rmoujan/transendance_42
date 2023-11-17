import React from "react";
import { Button, Dialog, DialogTitle, Stack } from "@mui/material";
import { CaretLeft } from "@phosphor-icons/react";
import { toggleDialog, updatedContactInfo } from "../../redux/slices/contact";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";
import Messages from "../converstation/Messages";


const SharedMsgs = () => {
  const dispatch = useAppDispatch();
  const { contact } = useAppSelector((store) => store);
  // console.log(contact);

  return (
    <Dialog
      open={contact.contactInfos.open}
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
