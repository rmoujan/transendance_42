import { Box, Button, ButtonProps, Divider, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ArchiveBox, MagnifyingGlass } from "@phosphor-icons/react";
import ChatElements from "../../components/ChatElements";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/search";
import { ChatList } from "../../data";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";
import { useEffect } from "react";
import { socket } from "../../socket";
import { fetchConverstations } from "../../redux/slices/converstation";

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
  // console.log(conversations);
  // const { _id } = useAppSelector((state) => state.profile);

  // useEffect(() => {
  //   socket.emit("get_direct_conversations", { _id }, (data) => {
  //     console.log(data); // this data is the list of conversations
  //     // dispatch action

  //     dispatch(fetchConverstations({ conversations: data }));
  //   });
  // }, []);

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

        <Stack padding={"10px 35px 20px"} spacing={2}>
          <Stack
            direction={"row"}
            alignContent={"center"}
            spacing={3}
            color="#709CE6"
            margin={"auto"}
            display={"block"}
          >
            <ColorButton
              startIcon={<ArchiveBox size={26} />}
              sx={{
                // margin: " 0 20px",
                width: "100%",
                fontSize: "18px", // Adjust the font size as needed
                padding: "8px 53px", // Adjust the padding as needed
                // neeed to make it center
                backgroundColor: "#806EA9", // Change the background color to purple
                color: "#3D2E5F", // Change the text color to white
                borderRadius: "21px",
                "&:hover": {
                  backgroundColor: "#684C83", // Change the background color on hover
                  color: "#C7BBD1",
                },
              }}
              variant="contained"
            >
              Archive
            </ColorButton>
          </Stack>
          <Divider sx={{ paddingTop: "2px", background: "#684C83a2" }} />
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
          {/* <SimpleBarStyle timeout={500} clickOnTrack={false}> */}
          <Stack>
            {/* every converstation == */}
            {/* {Object.keys(rooms).map((key) => {
                  return (
                    <ChatElements
                      key={key}
                      name={rooms[key].name}
                      img={rooms[key].img}
                      msg={"the last msg"}
                      time={"10:45 PM"}
                      unread={2}
                      online={true}
                      roomId={key}
                      active={roomId === key}
                      // onClick={() => handleJoinRoom(key)}
                    />
                  );
                })} */}
            {conversations
              .filter((el: any) => !el.pinned)
              .map((el, index) => {
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
