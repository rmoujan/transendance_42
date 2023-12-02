import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Chat, Prohibit, UserMinus } from "@phosphor-icons/react";
import { useEffect } from "react";
import { BlockFriend, DeleteFriend, FetchFriends } from "../redux/slices/app";
import {
  selectConversation,
  showSnackbar,
  updatedContactInfo,
} from "../redux/slices/contact";
import {
  emptyConverstation,
  setCurrentConverstation,
} from "../redux/slices/converstation";
import { useAppDispatch, useAppSelector } from "../redux/store/store";
import { socket, socket_user } from "../socket";
import StyledBadge from "./StyledBadge";

const ContactElements = (cont: any) => {
  const { contact, profile } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const id = cont.id_user;

  useEffect(() => {
    const handleHistoryDms = (data: any) => {
      if (data.length === 0 || !data[0]) {
        dispatch(emptyConverstation());
      } else {
        dispatch(
          setCurrentConverstation({
            data,
            user_id: profile._id,
            room_id: contact.room_id,
          })
        );
      }
    };

    if (!contact.room_id) return;
    socket.emit("allMessagesDm", {
      room_id: contact.room_id,
      user_id: profile._id,
    });
    socket.on("historyDms", handleHistoryDms);

    return () => {
      socket.off("historyDms", handleHistoryDms);
    };
  }, [contact.room_id, profile._id, dispatch]);
  return (
    <Box
      sx={{
        width: "100%",
        height: 85,
        borderRadius: "1",
      }}
      p={2}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        sx={{ padding: "0 8px 14px" }}
      >
        <Stack direction={"row"} alignItems={"center"} spacing={2}>
           <Avatar src={cont.avatar} sx={{ width: 52, height: 52 }} />
          <Typography variant="subtitle2" color={"white"}>
            {cont.name}
          </Typography>
        </Stack>
        <Stack direction={"row"} spacing={1}>
          <IconButton
            onClick={() => {
              dispatch(updatedContactInfo("CONTACT"));
              dispatch(
                selectConversation({
                  room_id: id,
                  name: cont.name,
                  avatar: cont.avatar,
                  type_chat: "individual",
                })
              );
            }}
          >
            <Chat />
          </IconButton>

          <IconButton
            onClick={() => {
              const id_user: number = id;
              socket_user.emit("friends-list", id_user);
              socket_user.emit("newfriend", id_user);
              dispatch(DeleteFriend(id_user));
              dispatch(FetchFriends());
              dispatch(
                showSnackbar({
                  severity: "success",
                  message: `${cont.name} has been deleted`,
                })
              );
            }}
          >
            <UserMinus />
          </IconButton>
          <IconButton
            onClick={() => {
              const id_user: number = id;
              dispatch(BlockFriend(id_user));
              dispatch(FetchFriends());
              dispatch(
                showSnackbar({
                  severity: "success",
                  message: `${cont.name} has been blocked`,
                })
              );
            }}
          >
            <Prohibit />
          </IconButton>
        </Stack>
      </Stack>
      <Divider sx={{ background: "#3D3C65" }} />
    </Box>
  );
};

export default ContactElements;
