import React from "react";
import { Tabs } from "@mui/base/Tabs";
import { Dialog, DialogContent, DialogTitle, Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { StyledTab, StyledTabPanel, StyledTabsList } from "../tabs/StyledTabs";
import SetPassword from "./Password/SetPassword";
import RemovePassword from "./Password/RemovePassword";
import UpdatePassword from "./Password/UpdatePassword";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ChangePassword = ({ handleClose, el }: any) => {
  return (
    <Tabs defaultValue={0}>
      <StyledTabsList>
        <StyledTab value={0}>Set New Password</StyledTab>
        <StyledTab value={1}>Remove Password</StyledTab>
        <StyledTab value={2}>Change Password</StyledTab>
      </StyledTabsList>
      <StyledTabPanel value={0}>
        <SetPassword
          handleClose={handleClose}
          el={el.el}
          user_id={el.user_id}
        />
      </StyledTabPanel>
      <StyledTabPanel value={1}>
        <RemovePassword
          handleClose={handleClose}
          el={el.el}
          user_id={el.user_id}
        />
      </StyledTabPanel>
      <StyledTabPanel value={2}>
        <UpdatePassword
          handleClose={handleClose}
          el={el.el}
          user_id={el.user_id}
        />
      </StyledTabPanel>
    </Tabs>
  );
};

const ChangeChannels = ({ open, handleClose, el }: any) => {
  console.log(el.user_id);
  console.log(el.el);
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
      <DialogTitle sx={{ mb: 4 }}>Change Channels</DialogTitle>
      <DialogContent sx={{ mb: 2 }}>
        <ChangePassword handleClose={handleClose} el={el} />
      </DialogContent>
    </Dialog>
  );
};

export default ChangeChannels;
