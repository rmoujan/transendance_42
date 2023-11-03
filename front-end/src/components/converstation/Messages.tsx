import { Box, Stack } from "@mui/material";
import { useEffect } from "react";
import {
  fetchCurrentMessages,
  setCurrentConverstation,
} from "../../redux/slices/converstation.ts";
import { useAppDispatch, useAppSelector } from "../../redux/store/store.ts";
import { socket } from "../../socket.ts";
import { MediaMsg, ReplyMsg, TextMsg, Timeline } from "./MsgTypes.tsx";

const Messages = () => {
  const dispatch = useAppDispatch();
  const { conversations, current_messages } = useAppSelector(
    (state) => state.converstation.direct_chat
  );
  const { room_id } = useAppSelector((state) => state.contact);

  useEffect(() => {
    const current = conversations.find((el) => el?.id === room_id);

    socket.emit(
      "get_messages",
      { conversation_id: current?.id },
      (data: any) => {
        // data => list of messages
        console.log(data, "List of messages");
        dispatch(fetchCurrentMessages({ messages: data }));
      }
    );

    dispatch(setCurrentConverstation(current));
  }, [conversations, room_id, dispatch]);

  return (
    <Box p={1} sx={{ width: "100%", borderRadius: "64px" }}>
      {/* <ScrollBar> */}
      <Stack spacing={2}>
        {current_messages.map((el: any) => {
          // console.log(el)
          switch (el.type) {
            case "divider":
              return <Timeline el={el} />;
            case "msg":
              switch (el.subtype) {
                case "img":
                  return <MediaMsg el={el} />;
                case "doc":
                  // doc msg
                  break;
                case "link":
                  // link msg
                  break;
                case "reply":
                  return <ReplyMsg el={el} />;
                default:
                  return <TextMsg el={el} />;
              }
              break;
            default:
              return <></>;
          }
        })}
      </Stack>
      {/* </ScrollBar> */}
    </Box>
  );
};

export default Messages;
