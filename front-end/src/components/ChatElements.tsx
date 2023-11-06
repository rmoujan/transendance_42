import { Avatar, Badge, Box, Stack, Typography } from "@mui/material";
import StyledBadge from "./StyledBadge";
import { styled } from "@mui/system";
import { useAppDispatch, useAppSelector } from "../redux/store/store";
import { selectConversation } from "../redux/slices/contact";
import { socket } from "../socket";
import {
  fetchCurrentMessages,
  setCurrentConverstation,
} from "../redux/slices/converstation";
// import { useDispatch, useSelector } from "react-redux";
// import { SelectConversation } from "../redux/slices/App";
// import { SelectConversation } from "../redux/slices/app";

interface IdType {
  id: number;
  name: string;
  img: string;
  time: string;
  msg: string;
  unread: number;
  online: boolean;
}

const StyledChatBox = styled(Box)(() => ({
  "&:hover": {
    cursor: "pointer",
  },
}));

const ChatElements = (id: IdType) => {
  const { contact, profile } = useAppSelector(state => state);
  const dispatch = useAppDispatch();
  const selected_id = id.id;
  const selectedChatId = contact.room_id;
  let isSelected = +selectedChatId === id.id;

  if (!selectedChatId) {
    isSelected = false;
  }

  return (
    <StyledChatBox
      onClick={() => {
        socket.emit("allMessagesDm", { room_id: selected_id });
        socket.on("historyDms", (data: any) => {
          dispatch(setCurrentConverstation(data));
          dispatch(
            selectConversation({
              room_id: selected_id,
              name: id.name,
              type_chat: "individual",
              avatar: id.img,
            })
          );
        });
      }}
      sx={{
        width: "100%",
        height: 85,
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
              {id.msg}
            </Typography>
          </Stack>
        </Stack>
        <Stack spacing={2} alignItems={"center"}>
          <Typography
            sx={{ fontWeight: 600, paddingBottom: "10px", paddingTop: 0 }}
            variant="caption"
          >
            {id.time}
            {/* 10:45 PM */}
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
