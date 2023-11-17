import { Avatar, Badge, Box, Stack, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useEffect } from "react";
import {
  setCurrentChannel,
  updateChannelsMessages,
} from "../redux/slices/channels";
import { selectConversation, updatedContactInfo } from "../redux/slices/contact";
import { useAppDispatch, useAppSelector } from "../redux/store/store";
import { socket } from "../socket";

interface IdType {
  channel_id: string;
  name: string;
  image: string;
  time: string;
  last_messages: string;
  unread: number;
  channel_type: string;
}

const StyledChatBox = styled(Box)(() => ({
  "&:hover": {
    cursor: "pointer",
  },
}));

const SmallAvatar = styled(Avatar)(() => ({
  width: 22,
  height: 22,
  // border: `2px solid ${theme.palette.background.paper}`,
}));

const ChannelElements = (id: IdType) => {
  console.log(id);
  const { contact, profile } = useAppSelector(state => state);
  const dispatch = useAppDispatch();
  const selected_id = id.channel_id;
  // console.log("selected_id", selected_id);
  const selectedChatId = contact.room_id;
  let isSelected = +selectedChatId === parseInt(selected_id);

  if (!selectedChatId) {
    isSelected = false;
  }

  useEffect(() => {
    const handleHistoryChannel = (data: any) => {
      console.log("history data", data);
      dispatch(setCurrentChannel({ messages: data, user_id: profile._id }));
    };

    const handleChatToGroup = (data: any) => {
      console.log("chat data", data);
      dispatch(
        updateChannelsMessages({ messages: data, user_id: profile._id })
      );
    };

    if (parseInt(selected_id) === contact.room_id) {
      socket.emit("allMessagesRoom", { id: selected_id, user_id: profile._id });

      // Subscribe to hostoryChannel only once when the component mounts
      socket.once("hostoryChannel", handleHistoryChannel);

      // Subscribe to chatToGroup every time a new message is added
      socket.on("chatToGroup", handleChatToGroup);
    }

    return () => {
      // Unsubscribe from the events when the component unmounts
      socket.off("hostoryChannel", handleHistoryChannel);
      socket.off("chatToGroup", handleChatToGroup);
    };
  }, [selected_id, socket, contact.room_id, dispatch, profile._id]);

  return (
    <StyledChatBox
      onClick={() => {
        console.log("id", selected_id);
        dispatch(updatedContactInfo("CHANNEL"));
        dispatch(
          selectConversation({
            room_id: selected_id,
            name: id.name,
            type_chat: id.channel_type,
            avatar: id.image,
          })
        );
      }}
      sx={{
        width: "100%",
        height: 85,
        backgroundColor: isSelected ? "#3A3B3C" : "transparent",
      }}
      p={2}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        sx={{ padding: "0 8px 0 4px" }}
      >
        <Stack direction={"row"} alignItems={"center"} spacing={2}>
          {id.channel_type === "protected" ? (
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={<SmallAvatar alt={id.name} src={id.image} />}
            >
              <Avatar
                sx={{ width: 52, height: 52 }}
                alt={id.name}
                src={id.image}
              />
            </Badge>
          ) : (
            <Avatar src={id.image} sx={{ width: 52, height: 52 }} />
          )}
          <Stack spacing={1.2} px={1}>
            <Typography variant="h6" color={"black"}>
              {id.name}
            </Typography>
            <Typography
              variant="caption"
              color={"white"}
              sx={{ fontWeight: 400 }}
            >
              {id.last_messages ? id.last_messages : "there is no message yet"}
            </Typography>
          </Stack>
        </Stack>
        <Stack spacing={2} alignItems={"center"}>
          <Typography
            sx={{ fontWeight: 600, paddingBottom: "10px", paddingTop: 0 }}
            variant="caption"
          >
            {/* {id.time} */}
            10:45 PM
          </Typography>
          {id.unread > 0 && (
            <Badge
              color="primary"
              badgeContent={id.unread}
              sx={{ paddingBottom: "9px", paddingTop: 0 }}
            ></Badge>
          )}
        </Stack>
      </Stack>
    </StyledChatBox>
  );
};

export default ChannelElements;
