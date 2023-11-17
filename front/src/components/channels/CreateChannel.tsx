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

const CreateChannel = ({ open, handleClose, el }: any) => {
  console.log(el);
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
          backgroundColor: "#AE9BCD",
          borderRadius: "28px",
          // padding: "32px 135px",
        },
      }}
    >
      {/* {console.log(handleClose)} */}
      <DialogTitle sx={{ mb: 4 }}>Create a New Channel</DialogTitle>
      <DialogContent sx={{ mb: 2 }}>
        <CreateTabs handleClose={handleClose} el={el} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannel;
