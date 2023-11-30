import { Box, Stack } from "@mui/material";
import { useAppSelector } from "../../redux/store/store.ts";
import { TextMsg, Timeline } from "./MsgTypes.tsx";

const Messages = () => {
  const { contact } = useAppSelector(state => state);
  const {type_chat } = contact;
  var messages: any = [];

  if (type_chat === "individual") {
    const { current_messages } = useAppSelector(
      state => state.converstation.direct_chat
    );
    messages = current_messages;
  } else {
    const { current_messages } = useAppSelector(state => state.channels);
    messages = current_messages;
  }

  return (
    <Box p={1} sx={{ width: "100%", borderRadius: "64px" }}>
      <Stack spacing={2}>
        {messages.map((el: any, index: number) => {
          switch (el.type) {
            case "divider":
              return <Timeline key={index} el={el} />;
            case "msg":
              switch (el.subtype) {
                default:
                  return <TextMsg key={index} el={el}/>;
              }
            default:
              return <></>;
          }
        })}
      </Stack>
    </Box>
  );
};

export default Messages;
