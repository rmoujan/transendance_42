import { Box, Stack } from "@mui/material";
import { Chat_History } from "../../data";
import ScrollBar from "../ScrollBar.tsx";
import { MediaMsg, ReplyMsg, TextMsg, Timeline } from "./MsgTypes.tsx";
import { useAppSelector } from "../../redux/store/store.ts";

const Messages = () => {
  // const dispatch = useAppDispatch();
  const { current_messages } = useAppSelector(
    state => state.converstation.direct_chat
  );

  // const { room_id } = useAppSelector((state) => state.contact);

  // useEffect(() => {
  //   const current = conversations.find((el) => el?.id === room_id);

  //   // socket.emit("get_messages", { conversation_id: current?.id }, (data: any) => {
  //     // data => list of messages
  //     // console.log(data, "List of messages");
  //     // dispatch(fetchCurrentMessages({ messages: data }));
  //   // });

  //   dispatch(setCurrentConverstation(current));
  // }, []);

  return (
    <Box p={1} sx={{ width: "100%", borderRadius: "64px" }}>
      <ScrollBar>
        <Stack spacing={2}>
          {current_messages.map(el => {
            switch (el?.type) {
              case "divider":
                return <Timeline el={el} />;
              case "msg":
                switch (el?.subtype) {
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
      </ScrollBar>
    </Box>
  );
};

export default Messages;
