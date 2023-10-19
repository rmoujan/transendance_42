import { faker } from "@faker-js/faker";
import {
    Avatar,
    Box,
    Button,
    Dialog,
    DialogTitle,
    Divider,
    IconButton,
    Slide,
    Stack,
    Typography
} from "@mui/material";
import { TransitionProps } from '@mui/material/transitions';
import {
    CaretRight,
    Prohibit,
    SpeakerSimpleX,
    Star,
    Trash,
    X,
} from "@phosphor-icons/react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleDialog, updatedContactInfo } from "../../redux/slices/App";

import { BlockDialog, DeleteDialog, MuteDialog } from "../dialogs/Dialogs";


const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const InfosContact = () => {

    const dispatch = useDispatch();
    const { contactInfo } = useSelector((store) => store.app);
  
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

  return (
    <Dialog
      open={contactInfo.open}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => {
        dispatch(toggleDialog());
      }}
      // aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle sx={{ m: "0 4px", p: 2 }}>{"Contact info"}</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => {
          dispatch(toggleDialog());
        }}
        sx={{
          position: "absolute",
          right: 9,
          top: 10,
          color: (theme) => theme.palette.grey[500],
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
          overflowY: "scroll",
        }}
        p={3}
        spacing={3}
      >
        {/* adding image in and username */}
        <Stack alignItems={"center"} direction={"column"} spacing={2}>
          <Avatar
            alt={faker.person.firstName()}
            src={faker.image.avatar()}
            sx={{ width: 200, height: 200 }}
          />
          {/* name */}
          <Stack direction={"column"} alignItems={"center"}>
            <Typography variant="h3" color={"#322554"} sx={{ padding: 0 }}>
              {faker.person.firstName()}
            </Typography>
          </Stack>
        </Stack>
        {/* media */}
        <Stack alignItems={"center"} direction={"column"} spacing={1}>
          <Box
            sx={{
              width: 580,
              height: "100%",
              padding: "25px",
              margin: 0,
              borderRadius: "35px",
              backgroundColor: "#EADDFF",
            }}
          >
            <Stack
              alignItems={"center"}
              direction={"row"}
              justifyContent={"space-between"}
            >
              <Typography variant="subtitle1">Media</Typography>
              <Button
                onClick={() => {
                  dispatch(updatedContactInfo("SHARED"));
                }}
                endIcon={<CaretRight />}
              >
                {console.log(contactInfo)}
                401
              </Button>
            </Stack>
            <Stack alignItems={"center"} direction={"row"} spacing={2}>
              {[1, 2, 3].map((el) => (
                <Box
                  sx={{
                    borderRadius: "5px",
                  }}
                >
                  <img
                    src={faker.image.food()}
                    alt={faker.person.fullName()}
                    style={{ borderRadius: "15px" }}
                  />
                </Box>
              ))}
            </Stack>
          </Box>
        </Stack>
        <Divider />
        {/* Starred messages */}
        <Stack
          alignItems={"center"}
          direction={"row"}
          justifyContent={"space-between"}
        >
          <Stack alignItems={"center"} direction={"row"} spacing={2}>
            <Star />
            <Typography variant="subtitle1">Starred Messages</Typography>
          </Stack>
          <IconButton
            onClick={() => {
              dispatch(updatedContactInfo("STARRED"));
            }}
          >
            <CaretRight />
          </IconButton>
        </Stack>
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
  )
}

export default InfosContact