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

const HeaderChannels = () => {
  const dispatch = useAppDispatch();
  const [openInvite, setOpenInvite] = React.useState(false);
  const { contact } = useAppSelector(state => state);
  const { channels } = useAppSelector(state => state.channels);
  const member = channels.find(
    channel => parseInt(channel.channel_id) === contact.room_id
  );

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
        <Stack direction={"row"} alignItems={"center"} spacing={1}>
          <Box>
            <IconButton>
              <Avatar
                onClick={() => {
                  dispatch(toggleDialog());
                }}
                alt={contact.name}
                src={contact.avatar}
                sx={{ width: 46, height: 46 }}
              />
            </IconButton>
          </Box>
          <Stack spacing={0.75}>
            {/* bold */}
            <Typography
              variant="h6"
              color={"#fff"}
              sx={{ padding: 0, fontWeight: "bold" }}
            >
              {contact.name}
            </Typography>
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <Typography
                variant="subtitle2"
                color={"#322554"}
                sx={{ padding: 0, fontWeight: 600, fontSize: "14px" }}
              >
                {member?.members.join(", ")}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
        <Stack direction={"row"} alignItems={"center"} spacing={3}>
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

export default HeaderChannels;
