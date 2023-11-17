import { Box, Stack } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../redux/store/store.ts";
import { MediaMsg, ReplyMsg, TextMsg, Timeline } from "./MsgTypes.tsx";

const Messages = () => {
  const dispatch = useAppDispatch();
  const { contact, profile } = useAppSelector(state => state);
  const { room_id, type_chat } = contact;
  // console.log(type_chat);
  var messages: any = [];
  if (type_chat === "individual") {
    // console.log("individual");
    const { current_messages, conversations } = useAppSelector(
      state => state.converstation.direct_chat
    );
    // console.log(conversations);
    // if ()
    // console.log(room_id)
    messages = current_messages;
  } else {
    const { current_messages } = useAppSelector(state => state.channels);
    // console.log(current_messages);
    messages = current_messages;
  }

  return (
    <Box p={1} sx={{ width: "100%", borderRadius: "64px" }}>
      {/* <ScrollBar> */}
      <Stack spacing={2}>
        {messages.map((el: any, index: number) => {
          // console.log(el)
          switch (el.type) {
            case "divider":
              return <Timeline key={index} el={el} />;
            case "msg":
              switch (el.subtype) {
                case "img":
                  return <MediaMsg key={index} el={el} />;
                case "reply":
                  return <ReplyMsg key={index} el={el} />;
                default:
                  return <TextMsg key={index} el={el} />;
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
