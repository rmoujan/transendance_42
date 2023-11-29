import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Stack,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import axios from "axios";
import React from "react";
import {
  BlockFriend,
  DeleteFriend,
  FetchFriends,
} from "../../redux/slices/app";
import {
  FetchChannels,
  FetchPrivatesChannels,
  FetchProtectedChannels,
  FetchPublicChannels,
} from "../../redux/slices/channels";
import {
  resetContact,
  showSnackbar,
  toggleDialog,
} from "../../redux/slices/contact";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";
import { socket, socket_user } from "../../socket";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MuteDialog = ({ open, handleClose }: any) => (
  <Dialog
    fullWidth
    maxWidth="sm"
    open={open}
    TransitionComponent={Transition}
    keepMounted
    onClose={handleClose}
    aria-describedby="alert-dialog-slide-description"
    PaperProps={{
      style: {
        backgroundColor: "#AE9BCD",
        boxShadow: "none",
        borderRadius: "35px",
        padding: "32px 0px",
      },
    }}
  >
    <DialogTitle
      style={{
        margin: "0",
        textAlign: "center",
        fontSize: "38px",
        padding: "24px",
        fontWeight: 800,
      }}
    >
      Mute this contact
    </DialogTitle>
    <DialogContent style={{ padding: 0 }}>
      <DialogContentText
        id="alert-dialog-slide-description"
        style={{
          margin: "0",
          textAlign: "center",
          fontSize: "22px",
          padding: "0px",
          fontWeight: 600,
          color: "#563F73",
        }}
      >
        Are you sure you want to mute this Contact?
      </DialogContentText>
    </DialogContent>
    <DialogActions style={{ margin: "0", justifyContent: "space-evenly" }}>
      <Button
        onClick={handleClose}
        sx={{
          borderRadius: "15px",
          fontSize: "20px",
          padding: "15px 0px",
          color: "#EADDFF",
          width: "130px",
          backgroundColor: "#2A1F4D",
          "&:hover": { backgroundColor: "#8A65A1" },
        }}
      >
        Cancel
      </Button>
      <Button
        onClick={handleClose}
        sx={{
          borderRadius: "15px",
          fontSize: "20px",
          padding: "15px 22px",
          color: "#EADDFF",
          width: "130px",
          backgroundColor: "#DF1D1D",
          "&:hover": { backgroundColor: "#ef8285" },
        }}
      >
        Yes
      </Button>
    </DialogActions>
  </Dialog>
);

const LeaveDialog = ({ open, handleClose, el }: any) => {
  const dispatch = useAppDispatch();
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      PaperProps={{
        style: {
          padding: "32px 0px",
          backgroundColor: "#696693",
          // boxShadow: "none",
          borderRadius: "35px",
        },
      }}
    >
      <DialogTitle
        style={{
          margin: "0",
          textAlign: "center",
          fontSize: "38px",
          padding: "24px",
          fontWeight: 800,
          color: "#25213B",
        }}
      >
        Leave this Channel
      </DialogTitle>
      <DialogContent style={{ padding: 0 }}>
        <DialogContentText
          id="alert-dialog-slide-description"
          style={{
            margin: "0",
            textAlign: "center",
            fontSize: "22px",
            padding: "0px 0px 24px",
            fontWeight: 600,
            color: "#B7B7C9",
          }}
        >
          Are you sure you want to Leave this Channel?
        </DialogContentText>
      </DialogContent>
      <DialogActions style={{ margin: "0", justifyContent: "space-evenly" }}>
        <Button
          onClick={handleClose}
          sx={{
            borderRadius: "15px",
            fontSize: "20px",
            padding: "15px 0px",
            color: "#EADDFF",
            width: "130px",
            fontWeight: 600,
            backgroundColor: "#3D3954",
            "&:hover": { backgroundColor: "#3D3C65" },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            handleClose();
            socket.emit("leaveChannel", {
              user_id: el.user_id,
              channel_id: el.channel_id,
            });
            socket.on("ResponseLeaveUser", (data: any) => {
              if (data == true) {
                dispatch(toggleDialog());
                dispatch(FetchChannels());
                dispatch(FetchProtectedChannels());
                dispatch(FetchPublicChannels());
                dispatch(FetchPrivatesChannels());
                dispatch(resetContact());
                dispatch(
                  showSnackbar({
                    severity: "success",
                    message: "You have removed channel successfully",
                  })
                );
              } else {
                dispatch(
                  showSnackbar({
                    severity: "error",
                    message: "Leave from this channel is unsuccessful",
                  })
                );
              }
            });
          }}
          sx={{
            borderRadius: "15px",
            fontSize: "20px",
            padding: "15px 22px",
            color: "#EADDFF",
            width: "130px",
            fontWeight: 600,
            backgroundColor: "#DC5833",
            "&:hover": { backgroundColor: "#FE754D" },
          }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DeleteDialog = ({ open, handleClose }: any) => {
  const dispatch = useAppDispatch();
  const { room_id, name } = useAppSelector((state) => state.contact);
  const handleDelete = () => {
    const id_user: number = room_id;
    socket_user.emit("friends-list", id_user);
    socket_user.emit("newfriend", id_user);
    dispatch(DeleteFriend(id_user));
    dispatch(FetchFriends());
    dispatch(toggleDialog());
    dispatch(resetContact());
    dispatch(
      showSnackbar({
        severity: "success",
        message: `${name} has been deleted`,
      })
    );
  };
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      PaperProps={{
        style: {
          padding: "32px 0px",
          backgroundColor: "#696693",
          borderRadius: "35px",
        },
      }}
    >
      <DialogTitle
        style={{
          margin: "0",
          textAlign: "center",
          fontSize: "38px",
          padding: "24px",
          fontWeight: 800,
          color: "#25213B",
        }}
      >
        Delete this Contact
      </DialogTitle>
      <DialogContent style={{ padding: 0 }}>
        <DialogContentText
          id="alert-dialog-slide-description"
          style={{
            margin: "0",
            textAlign: "center",
            fontSize: "22px",
            padding: "0px 0px 24px",
            fontWeight: 600,
            color: "#B7B7C9",
          }}
        >
          Are you sure you want to delete this Friend?
        </DialogContentText>
      </DialogContent>
      <DialogActions style={{ margin: "0", justifyContent: "space-evenly" }}>
        <Button
          onClick={handleClose}
          sx={{
            borderRadius: "15px",
            fontSize: "20px",
            padding: "15px 0px",
            color: "#EADDFF",
            width: "130px",
            fontWeight: 600,
            backgroundColor: "#3D3954",
            "&:hover": { backgroundColor: "#3D3C65" },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          sx={{
            borderRadius: "15px",
            fontSize: "20px",
            padding: "15px 22px",
            color: "#EADDFF",
            width: "130px",
            fontWeight: 600,
            backgroundColor: "#DC5833",
            "&:hover": { backgroundColor: "#FE754D" },
          }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const BlockDialog = ({ open, handleClose }: any) => {
  const dispatch = useAppDispatch();
  const { room_id, name } = useAppSelector((state) => state.contact);

  const handleBlock = () => {
    const id_user: number = room_id;
    dispatch(BlockFriend(id_user));
    dispatch(FetchFriends());
    dispatch(toggleDialog());
    dispatch(resetContact());
    dispatch(
      showSnackbar({
        severity: "success",
        message: `${name} has been blocked`,
      })
    );
  };
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      PaperProps={{
        style: {
          padding: "32px 0px",
          backgroundColor: "#696693",
          borderRadius: "35px",
        },
      }}
    >
      <DialogTitle
        style={{
          margin: "0",
          textAlign: "center",
          fontSize: "38px",
          padding: "24px",
          fontWeight: 800,
          color: "#25213B",
        }}
      >
        Block this contact
      </DialogTitle>
      <DialogContent style={{ padding: 0 }}>
        <DialogContentText
          id="alert-dialog-slide-description"
          style={{
            margin: "0",
            textAlign: "center",
            fontSize: "22px",
            padding: "0px 0px 24px",
            fontWeight: 600,
            color: "#B7B7C9",
          }}
        >
          Are you sure you want to block this Contact?
        </DialogContentText>
      </DialogContent>
      <DialogActions style={{ margin: "0", justifyContent: "space-evenly" }}>
        <Button
          onClick={handleClose}
          sx={{
            borderRadius: "15px",
            fontSize: "20px",
            padding: "15px 0px",
            color: "#EADDFF",
            width: "130px",
            fontWeight: 600,
            backgroundColor: "#3D3954",
            "&:hover": { backgroundColor: "#3D3C65" },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleBlock}
          sx={{
            borderRadius: "15px",
            fontSize: "20px",
            padding: "15px 22px",
            color: "#EADDFF",
            width: "130px",
            fontWeight: 600,
            backgroundColor: "#DC5833",
            "&:hover": { backgroundColor: "#FE754D" },
          }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const RemoveDialog = ({ open, handleClose, el }: any) => {
  const dispatch = useAppDispatch();
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      PaperProps={{
        style: {
          padding: "32px 0px",
          backgroundColor: "#696693",
          borderRadius: "35px",
        },
      }}
    >
      <DialogTitle
        style={{
          margin: "0",
          textAlign: "center",
          fontSize: "38px",
          padding: "24px",
          fontWeight: 800,
          color: "#25213B",
        }}
      >
        Remove this Channel
      </DialogTitle>
      <DialogContent style={{ padding: 0 }}>
        <DialogContentText
          id="alert-dialog-slide-description"
          style={{
            margin: "0",
            textAlign: "center",
            fontSize: "22px",
            padding: "0px 0px 24px",
            fontWeight: 600,
            color: "#B7B7C9",
          }}
        >
          Are you sure you want to Remove this Channel?
        </DialogContentText>
      </DialogContent>
      <DialogActions style={{ margin: "0", justifyContent: "space-evenly" }}>
        <Button
          onClick={handleClose}
          sx={{
            borderRadius: "15px",
            fontSize: "20px",
            padding: "15px 0px",
            color: "#EADDFF",
            width: "130px",
            fontWeight: 600,
            backgroundColor: "#3D3954",
            "&:hover": { backgroundColor: "#3D3C65" },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={async () => {
            console.log(el);
            const res = await axios.post(
              "http://localhost:3000/channels/removeChannel",
              {
                user_id: el.user_id,
                channel_id: el.channel_id,
              }
            );
            if (res.data === true) {
              dispatch(toggleDialog());
              dispatch(FetchChannels());
              dispatch(FetchProtectedChannels());
              dispatch(FetchPublicChannels());
              dispatch(FetchPrivatesChannels());
              dispatch(resetContact());
              dispatch(
                showSnackbar({
                  severity: "success",
                  message: "You have removed channel successfully",
                })
              );
            } else {
              dispatch(
                showSnackbar({
                  severity: "error",
                  message: "You have removed channel failed",
                })
              );
            }
            handleClose();
          }}
          sx={{
            borderRadius: "15px",
            fontSize: "20px",
            padding: "15px 22px",
            color: "#EADDFF",
            width: "130px",
            fontWeight: 600,
            backgroundColor: "#DC5833",
            "&:hover": { backgroundColor: "#FE754D" },
          }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const InviteDialog = ({ open, handleClose }: any) => (
  <Dialog
    // fullWidth
    // maxWidth="md"
    open={open}
    TransitionComponent={Transition}
    keepMounted
    onClose={handleClose}
    aria-describedby="alert-dialog-slide-description"
    // padding={15}
    // borderRadius={"55px"}
    PaperProps={{
      style: {
        backgroundColor: "#AE9BCD",
        boxShadow: "none",
        borderRadius: "45px",
        width: "100%",
        maxWidth: "680px",
        // padding: "32px 135px",
      },
    }}
  >
    <Stack justifyContent={"center"} p={"43px"}>
      <DialogTitle
        style={{
          margin: "0",
          textAlign: "center",
          fontSize: "32px",
          fontWeight: 800,
          color: "#322554",
        }}
      >
        Are you sure you want to Play ?
      </DialogTitle>
      <DialogActions
        style={{ margin: "0", justifyContent: "space-evenly", height: "150px" }}
      >
        {/* `make this create in the same level of figma */}
        <Stack direction={"row"} spacing={5} p={0}>
          <Button
            onClick={handleClose}
            sx={{
              borderRadius: "15px",
              fontSize: "20px",
              padding: "18px 22px",
              color: "#EADDFF",
              width: "150px",
              backgroundColor: "#563F73",
              "&:hover": { backgroundColor: "#563F73" },
            }}
          >
            Yes
          </Button>
          <Button
            onClick={handleClose}
            sx={{
              borderRadius: "15px",
              fontSize: "20px",
              padding: "18px 22px",
              color: "#EADDFF",
              width: "150px",
              backgroundColor: "#2A1F4D",
              "&:hover": { backgroundColor: "#2A1F4D" },
            }}
          >
            No
          </Button>
        </Stack>
      </DialogActions>
    </Stack>
  </Dialog>
);

export {
  BlockDialog,
  DeleteDialog, InviteDialog,
  LeaveDialog, MuteDialog, RemoveDialog
};

