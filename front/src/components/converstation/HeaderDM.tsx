import {
    Avatar,
    Box,
    Button,
    IconButton,
    Stack,
    Typography,
  } from "@mui/material";
  import React from "react";
  import { toggleDialog } from "../../redux/slices/contact";
  import { useAppDispatch, useAppSelector } from "../../redux/store/store";
  import StyledBadge from "../StyledBadge";
  import { InviteDialog } from "../dialogs/Dialogs";
  import { MenuOptions } from "./MsgTypes";
  
  const HeaderDM = () => {
    const dispatch = useAppDispatch();
    const [openInvite, setOpenInvite] = React.useState(false);
    const { contact } = useAppSelector(state => state);
  
    const handleCloseInvite = () => {
      setOpenInvite(false);
    };
    return (
      <Box
        sx={{
          padding: "14px 32px",
          width: "100%",
          background: "#5E4F80",
          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
          borderRadius: "44px 44px 0 0",
        }}
        //   p={2}
      >
        <Stack
          alignItems={"center"}
          direction={"row"}
          justifyContent={"space-between"}
          sx={{ width: "100%", height: "100%" }}
        >
          <Stack direction={"row"} alignItems={"center"} spacing={2}>
            <Box>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
                sx={{ width: 46, height: 46 }}
              >
                <IconButton>
                  <Avatar
                    onClick={() => {
                      // console.log(contact);
                      dispatch(toggleDialog());
                    }}
                    alt={contact.name}
                    src={contact.avatar}
                    sx={{ width: 46, height: 46 }}
                  />
                </IconButton>
              </StyledBadge>
            </Box>
            <Stack spacing={0.75}>
              <Typography variant="subtitle1" color={"#fff"} sx={{ padding: 0 }}>
                {contact.name}
              </Typography>
              <Typography
                variant="caption"
                color={"#322554"}
                sx={{ padding: 0, fontWeight: 400, fontSize: "14px" }}
              >
                Online {/* change this later */}
              </Typography>
            </Stack>
          </Stack>
          <Stack direction={"row"} alignItems={"center"} spacing={3}>
            {/* invite botton */}
            <Stack>
              <Button
                onClick={() => {
                  setOpenInvite(true);
                }}
                sx={{
                  backgroundColor: "#8979AC",
                  color: "#EADDFF",
                  padding: "10px 15px",
                  borderRadius: "22px",
                }}
              >
                Invite to Play
              </Button>
            </Stack>
            {/* Menu option is done */}
            <MenuOptions />
          </Stack>
        </Stack>
        {openInvite && (
          <InviteDialog open={openInvite} handleClose={handleCloseInvite} />
        )}
      </Box>
    );
  };
  
  export default HeaderDM;
  