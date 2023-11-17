import { Box, Button, ButtonProps, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useEffect } from "react";
import ChatElements from "../../components/ChatElements";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/search";
import {
  emptyConverstation,
  setCurrentConverstation,
} from "../../redux/slices/converstation";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";
import { socket } from "../../socket";

const ColorButton = styled(Button)<ButtonProps>(() => ({
  color: "#C7BBD1",
  backgroundColor: "#443263",
  "&:hover": {
    backgroundColor: "darkpurple",
  },
}));

const Privates = () => {
  const dispatch = useAppDispatch();

  const { conversations } = useAppSelector(
    state => state.converstation.direct_chat
  );
  const { profile, contact } = useAppSelector(state => state);

  useEffect(() => {
    const handleHistoryDms = (data: any) => {
      // console.log("history data", data);
      if (data === null) {
        // console.log("null");
        dispatch(emptyConverstation([]));
      } else {
        dispatch(setCurrentConverstation(data));
      }
    };
    if (!contact.room_id) return;
    // console.log(contact.room_id);
    // console.log(profile._id);
    socket.emit("allMessagesDm", {
      room_id: contact.room_id, // selected conversation
      user_id: profile._id, // current user
    });
    socket.once("historyDms", handleHistoryDms);

    return () => {
      socket.off("historyDms", handleHistoryDms);
    };
  }, [contact.room_id, profile._id, dispatch]);

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
            {conversations.map((el, index) => {
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
