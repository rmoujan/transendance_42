import { Box, Stack } from "@mui/material";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import AllElements from "../../components/AllElements";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/search";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";
import {
  emptyConverstation,
  fetchConverstations,
  setCurrentConverstation,
} from "../../redux/slices/converstation";
import { socket } from "../../socket";
import { FetchChannels, setCurrentChannel, setEmptyChannel, updateChannelsMessages } from "../../redux/slices/channels";

const All = () => {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const { conversations } = useAppSelector(
    (state) => state.converstation.direct_chat
  );
  const { channels } = useAppSelector((state) => state.channels);
  const { contact, profile } = useAppSelector((state) => state);

  console.log(contact);
  // add channels and conversations together
  // const ChatList = [...conversations, ...channels];

  useEffect(() => {
    if (contact.type_chat === "individual") {
      const handleHistoryDms = (data: any) => {
        console.log("history data", data);
        if (data === null) {
          // console.log("null");
          dispatch(emptyConverstation());
        } else {
          dispatch(setCurrentConverstation(data));
        }
      };
      if (!contact.room_id) return;
      socket.emit("allMessagesDm", {
        room_id: contact.room_id, // selected conversation
        user_id: profile._id, // current user
      });
      socket.once("historyDms", handleHistoryDms);
      socket.emit("allConversationsDm", { _id: profile._id });
      socket.on("response", (data: any) => {
        console.log(data);
        dispatch(
          fetchConverstations({ conversations: data, user_id: profile._id })
        );
      });

      return () => {
        socket.off("historyDms", handleHistoryDms);
      };
    }
    else {
      console.log('channels')
      const handleHistoryChannel = (data: any) => {
        if (data.length == 0) {
          dispatch(setEmptyChannel());
        } else {
          console.log(profile._id);
          dispatch(setCurrentChannel({ messages: data, user_id: profile._id }));
        }
      };
  
      const handleChatToGroup = (data: any) => {
        dispatch(
          updateChannelsMessages({ messages: data, user_id: profile._id })
        );
        dispatch(FetchChannels())
      };
      if (contact.room_id) {
        socket.emit("allMessagesRoom", { id: contact.room_id, user_id: profile._id });
        socket.once("hostoryChannel", handleHistoryChannel);
        socket.on("chatToGroup", handleChatToGroup);
      }
  
      return () => {
        socket.off("hostoryChannel", handleHistoryChannel);
        socket.off("chatToGroup", handleChatToGroup);
      };
    }
  }, [contact, profile._id, dispatch]);
  console.log(conversations);
  console.log(channels);

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
        room_id: channel_id,
        name,
        img: image,
        time,
        msg: last_messages,
        unread,
        channel_type,
      })
    ),
    users: conversations.map((el: any) => ({
      id: el.room_id,
      room_id: el.id,
      name: el.name,
      img: el.img,
      time: el.time,
      msg: el.msg,
      unread: el.unread,
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

  const filteredConversations = sortedConversation.filter((conversation: any) =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  const conversationsToDisplay = searchQuery
    ? filteredConversations
    : sortedConversation;

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
              onChange={onChange}
            />
          </Search>
        </Stack>
        <Stack padding={"10px 35px 20px"} spacing={2}></Stack>
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
            {conversationsToDisplay.map((el: any, index) => {
              return <AllElements key={index} {...el} />;
            })}
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default All;
