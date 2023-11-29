import { Avatar, Badge, Box, Stack, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useEffect } from "react";
import {
  selectConversation,
  updatedContactInfo,
} from "../redux/slices/contact";
import { setCurrentConverstation } from "../redux/slices/converstation";
import { useAppDispatch, useAppSelector } from "../redux/store/store";
import { socket } from "../socket";
import StyledBadge from "./StyledBadge";


/**
 * 
 * 
 * Type '{ room_id: string | null; id: string | null; user_id: string | null; name: string | null; online: boolean; img: string | null; msg: string | null; time: string | null; unread: number | null; pinned: boolean; key: number; }'
 */
export interface IdType {
  id: number;
  user_id?: number | undefined;
  room_id: number;
  name: string;
  img: string;
  time: string;
  msg: string;
  channel_type?: string | undefined;
  unread: number;
  online: boolean;
  pinned: boolean;
}

const StyledChatBox = styled(Box)(() => ({
  "&:hover": {
    cursor: "pointer",
  },
}));

const ChatElements = (id: IdType) => {
  const { contact, profile } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  let selected_id: number = 0;
  const selectedChatId = contact.room_id;
  // console.log(id);
  if (id.id && id.user_id && id.room_id) {
    selected_id = id.id;
    // console.log(id.id, id.user_id, id.room_id);
  } else if (id?.channel_type === "channel") {
    selected_id = id.id;
  } else {
    selected_id = id.room_id;
  }
  let isSelected = +selectedChatId === selected_id;

  if (!selectedChatId) {
    isSelected = false;
  }

  useEffect(() => {
    const handleHistoryDms = (data: any) => {
      dispatch(setCurrentConverstation({ data, user_id: profile._id }));
    };
    if (!contact.room_id) return;
    socket.emit("allMessagesDm", {
      room_id: contact.room_id, // selected conversation
      user_id: profile._id, // current user
    });
    socket.once("historyDms", handleHistoryDms);
  }, [contact.room_id, profile._id, dispatch]);

  return (
    <StyledChatBox
      onClick={() => {
        dispatch(updatedContactInfo("CONTACT"));
        console.log(selected_id, id.name, id.img);
        dispatch(
          selectConversation({
            room_id: selected_id,
            name: id.name,
            type_chat: "individual",
            avatar: id.img,
          })
        );
      }}
      sx={{
        width: "100%",
        height: 85,
        backgroundColor: isSelected ? "#FE754D" : "transparent",
        borderRadius: "15px",
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
          {id.online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar src={id.img} sx={{ width: 52, height: 52 }} />
            </StyledBadge>
          ) : (
            <Avatar src={id.img} sx={{ width: 52, height: 52 }} />
          )}
          <Stack spacing={1.3}>
            <Typography variant="subtitle2" color={"white"}>
              {id.name}
            </Typography>
            <Typography
              variant="caption"
              color={"white"}
              sx={{ fontWeight: 400 }}
            >
              {id.msg
                ? id.msg.length > 45
                  ? id.msg.substring(0, 45) + "..."
                  : id.msg
                : "There is no message yet"}
            </Typography>
          </Stack>
        </Stack>
        <Stack spacing={2} alignItems={"center"}>
          <Typography
            sx={{ fontWeight: 600, paddingBottom: "10px", paddingTop: 0 }}
            variant="caption"
          >
            {id.time}
          </Typography>
          <Badge
            color="primary"
            badgeContent={id.unread}
            sx={{ paddingBottom: "9px", paddingTop: 0 }}
          ></Badge>
        </Stack>
      </Stack>
    </StyledChatBox>
  );
};

export default ChatElements;