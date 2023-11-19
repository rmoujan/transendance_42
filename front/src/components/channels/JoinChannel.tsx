import {
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Typography,
} from "@mui/material";
import React from "react";
import JoinTabs from "./JoinTabs";
import { TransitionProps } from "@mui/material/transitions";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const JoinChannel = ({ open, handleClose }: any) => {
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      sx={{
        p: 5,
        "& .MuiPaper-root": {
          borderRadius: "26px",
        },
      }}
      PaperProps={{
        style: {
          backgroundColor: "#696693",
          borderRadius: "28px",
        },
      }}
    >
      {/* {console.log(handleClose)} */}
      <DialogTitle sx={{ my: 2 }}>
        {" "}
        <Typography
          variant="h4"
          align="center"
          fontWeight={600}
          color={"#25213B"}
        >
          Join to a New Channel
        </Typography>
      </DialogTitle>
      <DialogContent>
        <JoinTabs handleClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

export default JoinChannel;
