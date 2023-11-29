import { Avatar, Box, IconButton, Stack, Typography } from "@mui/material";
import React from "react";
import { toggleDialog } from "../../redux/slices/contact";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";
import { InviteDialog } from "../dialogs/Dialogs";
import { MenuOptions } from "./MsgTypes";

const HeaderChannels = () => {
  const dispatch = useAppDispatch();
  const [openInvite, setOpenInvite] = React.useState(false);
  const { contact, profile } = useAppSelector((state) => state);
  const { channels } = useAppSelector((state) => state.channels);
  const member = channels.find(
    (channel) => parseInt(channel.channel_id) === contact.room_id
  );
  console.log(profile);
  console.log(member);
  const currentUser: any = profile.name;
  // const admins = member?.admin
  const membersList = [
    member?.owner.join(", "),
    member?.admin.join(", "),
    member?.members.join(", ")
  ].filter(Boolean).join(", ");
  // console.log(membersList)
  // check if name is the same as profile.name replace it with 'me'
  const updatedString = membersList.replace(profile.name, 'me');

  const handleCloseInvite = () => {
    setOpenInvite(false);
  };

  return (
    <Box
      sx={{
        padding: "14px 32px",
        width: "100%",
        background: "#696693",
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
              color={"#B7B7C9"}
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
                {updatedString}
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
