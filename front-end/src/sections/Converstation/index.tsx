import { useEffect, useRef } from "react";
import { Box, Stack } from "@mui/material";
import Chatbox from "../../components/converstation/Chatbox";
import Header from "../../components/converstation/Header";
import Messages from "../../components/converstation/Messages";
import { useAppSelector } from "../../redux/store/store";

const Converstation = () => {
  const messageListRef = useRef<HTMLDivElement | null>(null);
  const { current_messages } = useAppSelector(
    state => state.converstation.direct_chat
  );

  useEffect(() => {
    // Scroll to the bottom of the message list when new messages are added
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [current_messages]);

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
