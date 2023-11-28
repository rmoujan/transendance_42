import {
  Avatar,
  Box,
  Button,
  Dialog,
  Divider,
  IconButton,
  Slide,
  Stack,
  Typography,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { Gear, Prohibit, SignOut, X } from "@phosphor-icons/react";
import React, { useEffect, useRef, useState } from "react";
import {
  resetContact,
  toggleDialog,
  updatedContactInfo,
} from "../../redux/slices/contact";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";
import ChangeChannels from "../channels/ChangeChannels";
import { LeaveDialog, RemoveDialog } from "../dialogs/Dialogs";
import MembersSettings from "./MembersSettings";
import { FetchChannels } from "../../redux/slices/channels";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const InfosChannel = () => {
  const currentInfos = useRef<any>(null);
  const [owner, setOwner] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [member, setMember] = useState(false);
  const dispatch = useAppDispatch();
  const { contact, channels, profile } = useAppSelector((store) => store);
  console.log(contact);
  console.log(channels);
  let img: string;
  useEffect(() => {
    let selectedChannel: any;
    if (contact.type_chat === "public") {
      console.log("public");
      selectedChannel = channels.publicChannels.find((channel: any) => {
        return channel?.id_channel === contact.room_id;
      });
    }
    if (contact.type_chat === "protected") {
      console.log("protected");
      selectedChannel = channels.protectedChannels.find(
        (channel: any) => channel?.id_channel === contact.room_id
      );
    }
    if (contact.type_chat === "private") {
      console.log(channels);
      console.log("private");
      console.log(contact.room_id);
      selectedChannel = channels.privateChannels.find(
        (channel: any) => channel?.id_channel === contact.room_id
      );
    }
    console.log(selectedChannel);
    const isOwner = selectedChannel.users.some((user: any) => {
      return (
        user.userId === profile._id && user.status_UserInChannel === "owner"
      );
    });
    const isAdmin = selectedChannel.users.some((user: any) => {
      return (
        user.userId === profile._id && user.status_UserInChannel === "admin"
      );
    });
    const isMember = selectedChannel.users.some((user: any) => {
      return (
        user.userId === profile._id && user.status_UserInChannel === "member"
      );
    });

    if (isMember && !isAdmin && !isOwner) {
      setMember(true);
      setAdmin(false);
      setOwner(false);
    } else if (isAdmin && !isOwner && !isMember) {
      setMember(false);
      setAdmin(true);
      setOwner(false);
    } else if (isOwner && !isAdmin && !isMember) {
      setMember(false);
      setAdmin(false);
      setOwner(true);
    }
  }, [contact, profile, channels]);
  console.log(channels.publicChannels);
  if (contact.type_chat === "public") {
    console.log("public");
    const channel = channels.publicChannels.find((channel: any) => {
      return channel?.id_channel === contact.room_id;
    });
    console.log(channel)

    currentInfos.current = channel;
    // contact.name = channel?.name;
  } else if (contact.type_chat === "protected") {
    // console.log("protected");
    const channel = channels.protectedChannels.find(
      (channel: any) => channel?.id_channel === contact.room_id
    );
    console.log(channel)
    currentInfos.current = channel;

    // contact.name = channel?.name;
  } else if (contact.type_chat === "private") {
    console.log("private");
    const channel: any = channels.privateChannels.find(
      (channel: any) => channel?.id_channel === contact.room_id
    );
    console.log(channel);

    currentInfos.current = channel;
    console.log(currentInfos.current);
    img = channel.img;
  }

  const [openBlock, setOpenBlock] = useState(false);
  const [openLeave, setOpenLeave] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  const handleCloseBlock = () => {
    setOpenBlock(false);
  };
  const handleCloseLeave = () => {
    setOpenLeave(false);
  };

  const handleClickSettings = () => {
    setOpenSettings(false);
  };

  return (
    <Dialog
      open={contact.contactInfos.open}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => {
        dispatch(toggleDialog());
      }}
      PaperProps={{
        style: { backgroundColor: "#696693", borderRadius: "35px" },
      }}
    >
      <Typography
        sx={{
          my: 2,
        }}
        variant="h4"
        align="center"
        fontWeight={600}
        color={"#25213B"}
      >
        Channel info
      </Typography>
      <IconButton
        aria-label="close"
        onClick={() => {
          dispatch(toggleDialog());
        }}
        sx={{
          position: "absolute",
          left: "22.7em",
          top: 10,
          color: "#25213B",
        }}
      >
        <X />
      </IconButton>
      {owner && (
        <IconButton
          aria-label="close"
          onClick={() => {
            setOpenSettings(true);
          }}
          sx={{
            position: "absolute",
            left: "21em",
            top: 10,
            color: "#25213B",
          }}
        >
          <Gear />
        </IconButton>
      )}
      {/* <DialogContent> */}
      <Stack
        sx={{
          height: "100%",
          position: "relative",
        }}
        p={3}
        spacing={3}
      >
        <Stack alignItems={"center"} direction={"column"} spacing={2}>
          <Stack>
            <Avatar
              alt={contact.name}
              src={currentInfos.current.img}
              sx={{ width: 200, height: 200 }}
            />
          </Stack>
          {/* name */}
          <Stack direction={"column"} alignItems={"center"}>
            <Typography
              variant="h3"
              color={"#25213B"}
              sx={{ padding: 0, fontWeight: 700 }}
            >
              {currentInfos.current?.name}
            </Typography>
            <Typography variant="h5" color={"#322554"} sx={{ padding: 0 }}>
              {currentInfos.current?.users.length} members
            </Typography>
            {owner && (
              <Typography variant="h5" color={"#322554"} sx={{ padding: 0 }}>
                [ Owner ]
              </Typography>
            )}
            {admin && (
              <Typography variant="h5" color={"#322554"} sx={{ padding: 0 }}>
                [ Admin ]
              </Typography>
            )}
            {member && (
              <Typography variant="h5" color={"#322554"} sx={{ padding: 0 }}>
                [ Member ]
              </Typography>
            )}
          </Stack>
        </Stack>
        <Divider />
        {/* statics */}
        <Stack direction={"column"} alignItems={"center"}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              width: 580,
              height: 385,
              flexGrow: 1,
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "0.4em",
              },
              padding: "32px 0",
              borderRadius: "35px",
              backgroundColor: "#B7B7C9",
            }}
          >
            {/* make an array */}
            <Stack spacing={1}>
              {currentInfos.current?.users.map((member: any) => (
                <MembersSettings
                  el={member}
                  isOwner={owner}
                  isAdmin={admin}
                  isMember={member}
                />
              ))}
            </Stack>
          </Box>
        </Stack>
        <Divider />
        {/* Buttons */}
        <Stack direction={"row"} justifyContent={"center"} spacing={4}>
          <Button
            onClick={() => {
              setOpenLeave(true);
            }}
            variant="contained"
            endIcon={<SignOut size={30} />}
            sx={{
              borderRadius: "15px",
              fontSize: "20px",
              padding: "10px 22px",
              color: "#EADDFF",
              backgroundColor: "#3D3C65",
              "&:hover": {
                backgroundColor: "#3D3954",
              },
            }}
          >
            Leave
          </Button>
          {owner && (
            <Button
              onClick={() => {
                setOpenBlock(true);
              }}
              variant="contained"
              endIcon={<Prohibit size={30} />}
              sx={{
                borderRadius: "15px",
                fontSize: "20px",
                padding: "10px 22px",
                color: "#EADDFF",
                backgroundColor: "#3D3C65",
                "&:hover": {
                  backgroundColor: "#3D3954",
                },
              }}
            >
              Remove
            </Button>
          )}
        </Stack>
      </Stack>
      {openLeave && (
        <LeaveDialog
          open={openLeave}
          handleClose={handleCloseLeave}
          el={{
            user_id: profile._id,
            channel_id: currentInfos.current?.id_channel,
          }}
        />
      )}
      {openBlock && (
        <RemoveDialog
          open={openBlock}
          handleClose={handleCloseBlock}
          el={{
            user_id: profile._id,
            channel_id: currentInfos.current?.id_channel,
          }}
        />
      )}
      {openSettings && (
        <ChangeChannels
          open={openSettings}
          handleClose={handleClickSettings}
          el={{ el: currentInfos.current, user_id: profile._id }}
        />
      )}
    </Dialog>
  );
};

export default InfosChannel;
