import { Dialog, DialogContent, DialogTitle, Slide } from "@mui/material";
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
    >
      {/* {console.log(handleClose)} */}
      <DialogTitle sx={{ mb: 4 }}>Create a New Channel</DialogTitle>
      <DialogContent>
        <CreateTabs handleClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannel;
