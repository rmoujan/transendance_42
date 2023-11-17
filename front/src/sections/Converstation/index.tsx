import { Box, Stack } from "@mui/material";
import { useEffect, useRef } from "react";
import Chatbox from "../../components/converstation/Chatbox";
import Header from "../../components/converstation/Header";
import Messages from "../../components/converstation/Messages";
import {
  addNewConversation,
  fetchCurrentMessages,
  updateUnread,
  updatedConverstation,
} from "../../redux/slices/converstation";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";
import { socket } from "../../socket";

const Converstation = () => {
  const dispatch = useAppDispatch();
  const messageListRef: any = useRef(null);
  const { current_messages, conversations } = useAppSelector(
    state => state.converstation.direct_chat
  );
  const { profile, contact } = useAppSelector(state => state);

  useEffect(() => {
    // Scroll to the bottom of the message list when new messages are added
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;

    const handleChatToDm = (data: any) => {
      dispatch(
        fetchCurrentMessages({
          id: data.id,
          type: "msg",
          message: data.message,
          outgoing: data.send === profile._id,
          incoming: data.recieve === profile._id,
        })
      );
      const now = new Date();
      console.log(conversations);

      const newDataConversation = {
        id: data.id,
        user_id: profile._id,
        name: contact.name,
        img: contact.avatar,
        message: data.message,
        status: "Online",
        time: now.toISOString(),
        unread: 0,
      };
      const existingConversation = conversations.find(
        el => el.room_id === data.id
      );
      console.log(existingConversation);
      if (!existingConversation) {
        console.log(data);
        dispatch(addNewConversation(newDataConversation));
        // dispatch(updateUnread(data));
      } else {
        console.log(data);
        dispatch(updatedConverstation(newDataConversation));
        // dispatch(updateUnread(data));
      }
    };
    socket.on("chatToDm", handleChatToDm);
    return () => {
      socket.off("chatToDm", handleChatToDm);
    };
  }, [dispatch, profile._id, contact.room_id, current_messages, conversations]);

  return (
    <Stack
      height={"100%"}
      maxHeight={"100vh"}
      width={"auto"}
      className="shadow-2xl"
      sx={
        {
          // borderRadius: "44px",
          // backgroundColor: "#806EA9",
        }
      }
    >
      {/* header chat */}
      <Header />
      {/* messaging */}
      <Box
        ref={messageListRef}
        width={"100%"}
        sx={{
          flexGrow: 1,
          height: "100%",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "0.4em",
          },
        }}
      >
        <Messages />
      </Box>

      {/* typing */}
      <Chatbox />
    </Stack>
  );
};

export default Converstation;
