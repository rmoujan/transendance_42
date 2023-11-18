import { Box, Stack } from "@mui/material";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useEffect } from "react";
import ChatElements from "../../components/ChatElements";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/search";
import { useAppSelector } from "../../redux/store/store";

const All = () => {
  const { conversations } = useAppSelector(
    state => state.converstation.direct_chat
  );
  const { channels } = useAppSelector(state => state.channels);

  // add channels and conversations together
  // const ChatList = [...conversations, ...channels];
  // console.log(conversations);
  // console.log(channels);

  const combinedObject = {
    channels: channels.map(
      ({
        channel_id,
        name,
        image,
        last_messages,
        time,
        unread,
        channel_type,
      }) => ({
        id: channel_id,
        name,
        image,
        time,
        msg: last_messages,
        unread,
        channel_type,
      })
    ),
    users: conversations.map(({ room_id, name, img, msg, time, unread }) => ({
      id: room_id,
      name,
      image: img,
      time,
      msg: msg,
      unread,
      channel_type: "direct",
    })),
  };
  const mergedConversation = [
    ...combinedObject.channels,
    ...combinedObject.users,
  ];
  const sortedConversation = mergedConversation.sort(
    (a: any, b: any) => a.time - b.time
  );

  return (
    <Box
      sx={{
        position: "relative",
        width: 452,
        // backgroundColor: "#806EA9",
        // boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        margin: "0 18px 18px",
        borderRadius: "25px",
      }}
    >
      <Stack sx={{ height: "calc(100vh - 320px)" }}>
        <Stack padding={1} sx={{ width: "100%" }}>
          <Search>
            <SearchIconWrapper>
              <MagnifyingGlass />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
        </Stack>
        <Stack
          direction={"column"}
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "0.4em",
            },
            height: "100%",
          }}
        >
          <Stack>
            {/* hellow */}
            {sortedConversation.map((el: any, index) => {
              return <ChatElements key={index} {...el} />;
            })}
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default All;
