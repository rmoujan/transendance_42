import { faker } from "@faker-js/faker";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  Divider,
  IconButton,
  Slide,
  Stack,
  Typography,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import {
  CaretRight,
  Prohibit,
  SpeakerSimpleX,
  Star,
  Trash,
  X,
} from "@phosphor-icons/react";
import React, { useRef, useState } from "react";
import { toggleDialog, updatedContactInfo } from "../../redux/slices/contact";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";

import { BlockDialog, DeleteDialog, MuteDialog } from "../dialogs/Dialogs";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const InfosContact = () => {
  const dispatch = useAppDispatch();
  const { contact } = useAppSelector(store => store);
  console.log(contact);


  const [openBlock, setOpenBlock] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openMute, setOpenMute] = useState(false);

  const handleCloseBlock = () => {
    setOpenBlock(false);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleCloseMute = () => {
    setOpenMute(false);
  };

  const handleFileUpload = () => {
    // handle click
  };

  return (
    <Dialog
      open={contact.contactInfos.open}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => {
        dispatch(toggleDialog());
      }}
      PaperProps={{
        style: { backgroundColor: "#AE9BCD", borderRadius: "35px" },
      }}
      // aria-describedby="alert-dialog-slide-description"
    >
      <Typography sx={{ m: "0 8px", p: 2 }} variant="h6">
        Contact info
      </Typography>
      {/* <DialogTitle sx={{ m: "0 8px", p: 2 }} >Contact info</DialogTitle> */}
      <IconButton
        aria-label="close"
        onClick={() => {
          dispatch(toggleDialog());
        }}
        sx={{
          position: "absolute",
          left: "22.7em",
          top: 10,
          color: theme => theme.palette.grey[800],
        }}
      >
        <X />
      </IconButton>
      {/* <DialogContent> */}
      <Stack
        sx={{
          height: "100%",
          position: "relative",
          flexGrow: 1,
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "0.4em",
          },
        }}
        p={3}
        spacing={3}
      >
        {/* adding image in and username */}
        <Stack alignItems={"center"} direction={"column"} spacing={2}>
          <Avatar
            alt={contact.name}
            src={contact.avatar}
            sx={{ width: 200, height: 200 }}
          />
          {/* name */}
          <Stack direction={"column"} alignItems={"center"}>
            <Typography variant="h3" color={"#322554"} sx={{ padding: 0 }}>
              {contact.name}
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        {/* statics */}
        <Stack direction={"row"} alignItems={"center"}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              width: 580,
              padding: "55px 0",
              margin: "10px",
              borderRadius: "35px",
              backgroundColor: "#EADDFF",
            }}
          >
            <Stack direction={"column"} alignItems={"center"}>
              <Typography variant="h3">Games</Typography>
              <Typography variant="h3">150</Typography>
            </Stack>
            <Divider orientation="vertical" variant="middle" flexItem />
            <Stack direction={"column"} alignItems={"center"}>
              <Typography variant="h3">Wins</Typography>
              <Typography variant="h3">150</Typography>
            </Stack>
            <Divider orientation="vertical" variant="middle" flexItem />
            <Stack direction={"column"} alignItems={"center"}>
              <Typography variant="h3">Loses</Typography>
              <Typography variant="h3">150</Typography>
            </Stack>
          </Box>
        </Stack>
        <Divider />
        {/* Buttons */}
        <Stack direction={"row"} justifyContent={"center"} spacing={4}>
          <Button
            onClick={() => {
              setOpenMute(true);
            }}
            variant="contained"
            endIcon={<SpeakerSimpleX size={30} />}
            sx={{
              borderRadius: "15px",
              fontSize: "20px",
              padding: "10px 22px",
              color: "#EADDFF",
              backgroundColor: "#322554",
              "&:hover": {
                backgroundColor: "#806EA9",
              },
            }}
          >
            Mute
          </Button>
          <Button
            onClick={() => {
              setOpenDelete(true);
            }}
            variant="contained"
            endIcon={<Trash size={30} />}
            sx={{
              borderRadius: "15px",
              fontSize: "20px",
              padding: "10px 22px",
              color: "#EADDFF",
              backgroundColor: "#322554",
              "&:hover": {
                backgroundColor: "#806EA9",
              },
            }}
          >
            Delete
          </Button>
          <Button
            onClick={() => {
              setOpenBlock(true);
            }}
            variant="contained"
            endIcon={<Prohibit size={30} />}
            sx={{
              borderRadius: "15px",
              fontSize: "20px",
              padding: "10px 22px",
              color: "#EADDFF",
              backgroundColor: "#DF1D1D",
              "&:hover": {
                backgroundColor: "#ef8285",
              },
            }}
          >
            Block
          </Button>
        </Stack>
      </Stack>
      {openMute && <MuteDialog open={openMute} handleClose={handleCloseMute} />}
      {openDelete && (
        <DeleteDialog open={openDelete} handleClose={handleCloseDelete} />
      )}
      {openBlock && (
        <BlockDialog open={openBlock} handleClose={handleCloseBlock} />
      )}
    </Dialog>
  );
};

export default InfosContact;
