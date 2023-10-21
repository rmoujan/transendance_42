import { Box, Stack } from "@mui/material";
import { Chat_History } from "../../data";
import { MediaMsg, ReplyMsg, TextMsg, Timeline } from "./MsgTypes.tsx";

const Messages = () => {
  return (
    <Box p={2} sx={{ width: "100%", flexGrow: "1", borderRadius: '64px' }}>
      <Stack spacing={2}>
        {Chat_History.map((el) => {
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
    </Box>
  );
};

export default Messages;
