import { Box, Stack } from "@mui/material";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import ChatElements from "../../components/ChatElements";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/search";
import {
  emptyConverstation,
  fetchConverstations,
  setCurrentConverstation,
} from "../../redux/slices/converstation";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";
import { socket } from "../../socket";

const Privates = () => {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");

  const { profile, contact } = useAppSelector((state) => state);
  const { conversations } = useAppSelector(
    (state) => state.converstation.direct_chat
  );
  const filteredConversations = conversations.filter((conversation: any) =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  console.log("im here");
  useEffect(() => {
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
  }, [contact.room_id, profile._id, dispatch]);

  const conversationsToDisplay = searchQuery
    ? filteredConversations
    : conversations;

  return (
    <Box
      sx={{
        position: "relative",
        width: 452,
        margin: "0 18px 18px",
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
            // backgroundColor: "#5E4F80",
            borderRadius: "23px",
          }}
        >
          {/* <SimpleBarStyle timeout={500} clickOnTrack={false}> */}
          <Stack>
            {conversationsToDisplay.map((el, index) => {
              return <ChatElements key={index} {...el} />;
            })}
          </Stack>
          {/* </SimpleBarStyle> */}
        </Stack>
      </Stack>
    </Box>
  );
};

export default Privates;