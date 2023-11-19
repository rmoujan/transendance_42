import {
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Typography,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React from "react";
import CreateTabs from "./CreateTabs";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CreateChannel = ({ open, handleClose }: any) => {
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
          // padding: "32px 135px",
        },
      }}
    >
      {/* {console.log(handleClose)} */}
      <DialogTitle sx={{ my: 2 }}>
        <Typography
          variant="h4"
          align="center"
          fontWeight={600}
          color={"#25213B"}
        >
          Create a New Channel
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ mb: 2 }}>
        <CreateTabs handleClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannel;
