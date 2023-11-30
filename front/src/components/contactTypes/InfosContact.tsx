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
  Prohibit,
  Trash,
  X
} from "@phosphor-icons/react";
import React, { useState } from "react";
import {
  toggleDialog
} from "../../redux/slices/contact";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";

import { BlockDialog, DeleteDialog } from "../dialogs/Dialogs";

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
  const { contact } = useAppSelector((store) => store);
  console.log(contact);

  const [openBlock, setOpenBlock] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleCloseBlock = () => {
    setOpenBlock(false);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
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
        style: { backgroundColor: "#696693", borderRadius: "35px" },
      }}
      // aria-describedby="alert-dialog-slide-description"
    >
      <Typography
        sx={{
          my: 2,
        }}
        variant="h4"
        align="center"
        fontWeight={600}
        color={"#25213B"}
      >
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
          color: "#25213B",
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
            <Typography
              variant="h3"
              color={"#25213B"}
              sx={{ padding: 0, fontWeight: 700 }}
            >
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
              backgroundColor: "#B7B7C9",
            }}
          >
            <Stack direction={"column"} alignItems={"center"}>
              <Typography variant="h3" fontWeight={600} color={"#3D3954"}>
                Games
              </Typography>
              <Typography variant="h3" color={"#3D3954"}>
                150
              </Typography>
            </Stack>
            <Divider orientation="vertical" variant="middle" flexItem />
            <Stack direction={"column"} alignItems={"center"}>
              <Typography variant="h3" fontWeight={600} color={"#3D3954"}>
                Wins
              </Typography>
              <Typography variant="h3" color={"#3D3954"}>
                150
              </Typography>
            </Stack>
            <Divider orientation="vertical" variant="middle" flexItem />
            <Stack direction={"column"} alignItems={"center"}>
              <Typography variant="h3" fontWeight={600} color={"#3D3954"}>
                Loses
              </Typography>
              <Typography variant="h3" color={"#3D3954"}>
                150
              </Typography>
            </Stack>
          </Box>
        </Stack>
        <Divider />
        {/* Buttons */}
        <Stack direction={"row"} justifyContent={"center"} spacing={4}>
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
              width: "200px",
              backgroundColor: "#3D3C65",
              "&:hover": {
                backgroundColor: "#3D3954",
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
              width: "200px",
              backgroundColor: "#3D3C65",
              "&:hover": {
                backgroundColor: "#3D3954",
              },
            }}
          >
            Block
          </Button>
        </Stack>
      </Stack>
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
