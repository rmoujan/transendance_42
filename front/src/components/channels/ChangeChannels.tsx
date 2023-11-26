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
  // console.log('===>', el.el)
  return (
    <Tabs defaultValue={0}>
      <StyledTabsList>
        {el.el.visibility === "public" && (
          <StyledTab value={0}>Set New Password</StyledTab>
        )}
        {el.el.visibility === "protected" && (
          <StyledTab value={1}>Remove Password</StyledTab>
        )}
        {el.el.visibility === "protected" && (
          <StyledTab value={2}>Change Password</StyledTab>
        )}
      </StyledTabsList>
      {el.el.visibility === "public" && (
        <StyledTabPanel value={0}>
          <SetPassword
            handleClose={handleClose}
            el={el.el}
            user_id={el.user_id}
          />
        </StyledTabPanel>
      )}
      {el.el.visibility === "protected" && (
        <StyledTabPanel value={1}>
          <RemovePassword
            handleClose={handleClose}
            el={el.el}
            user_id={el.user_id}
          />
        </StyledTabPanel>
      )}
      {el.el.visibility === "protected" && (
        <StyledTabPanel value={2}>
          <UpdatePassword
            handleClose={handleClose}
            el={el.el}
            user_id={el.user_id}
          />
        </StyledTabPanel>
      )}
    </Tabs>
  );
};

const ChangeChannels = ({ open, handleClose, el }: any) => {
  // console.log(el.user_id);
  // console.log(el.el);
  // console.log(el)
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
      <DialogTitle
        sx={{
          my: 2,
        }}
        variant="h4"
        align="center"
        fontWeight={600}
        color={"#25213B"}
      >
        Modify Current Channel
      </DialogTitle>
      <DialogContent sx={{ mb: 2 }}>
        <ChangePassword handleClose={handleClose} el={el} />
      </DialogContent>
    </Dialog>
  );
};

export default ChangeChannels;
