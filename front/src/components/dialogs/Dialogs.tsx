import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Slide,
  Stack,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { socket } from "../../socket";
import axios from "axios";

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

const LeaveDialog = ({ open, handleClose, el }: any) => (
  <Dialog
    fullWidth
    maxWidth="sm"
    open={open}
    TransitionComponent={Transition}
    keepMounted
    onClose={handleClose}
    aria-describedby="alert-dialog-slide-description"
    PaperProps={{ style: { backgroundColor: "#AE9BCD", boxShadow: "none" } }}
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
      Leave this Channel
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
          backgroundColor: "#2A1F4D",
          "&:hover": { backgroundColor: "#8A65A1" },
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
        }}
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

const DeleteDialog = ({ open, handleClose }: any) => (
  <Dialog
    fullWidth
    maxWidth="sm"
    open={open}
    TransitionComponent={Transition}
    keepMounted
    onClose={handleClose}
    aria-describedby="alert-dialog-slide-description"
    PaperProps={{ style: { backgroundColor: "#AE9BCD", boxShadow: "none" } }}
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
      Delete this Conversation
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
        Are you sure you want to delete this Conversation?
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

const BlockDialog = ({ open, handleClose }: any) => (
  <Dialog
    fullWidth
    maxWidth="sm"
    open={open}
    TransitionComponent={Transition}
    keepMounted
    onClose={handleClose}
    aria-describedby="alert-dialog-slide-description"
    PaperProps={{ style: { backgroundColor: "#AE9BCD", boxShadow: "none" } }}
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
      Block this contact
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

const RemoveDialog = ({ open, handleClose, el }: any) => (
  <Dialog
    fullWidth
    maxWidth="sm"
    open={open}
    TransitionComponent={Transition}
    keepMounted
    onClose={handleClose}
    aria-describedby="alert-dialog-slide-description"
    PaperProps={{ style: { backgroundColor: "#AE9BCD", boxShadow: "none" } }}
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
      Remove this Channels
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
        Are you sure you want to Remove this Channel for good?
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
        onClick={() => {
          handleClose();
          axios.post("http://localhost:3000/channels/removeChannel", {
            user_id: el.user_id,
            channel_id: el.channel_id,
          });
        }}
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
        Which level you want to play?
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
              padding: "18px 0px",
              color: "#EADDFF",
              width: "150px",
              backgroundColor: "#8A65A1",
              "&:hover": { backgroundColor: "#8A65A1" },
            }}
          >
            Easy
          </Button>
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
            Meduim
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
            Hard
          </Button>
        </Stack>
      </DialogActions>
    </Stack>
  </Dialog>
);

export {
  BlockDialog,
  DeleteDialog,
  MuteDialog,
  InviteDialog,
  LeaveDialog,
  RemoveDialog,
};
