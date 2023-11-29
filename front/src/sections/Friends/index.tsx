import { useEffect, useState } from "react";
import { Box, Button, Divider, Stack } from "@mui/material";
import { MagnifyingGlass, PlusCircle } from "@phosphor-icons/react";
import ContactElements from "../../components/ContactElements";
import ScrollBar from "../../components/ScrollBar";
import CreateChannel from "../../components/channels/CreateChannel";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/search";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";
import { FetchFriends, resetFriends } from "../../redux/slices/app";
import { socket_user } from "../../socket";
// import CreateChannel from "./CreateChannel";

const Friends = () => {
  const { friends } = useAppSelector((state) => state.app);
  console.log(friends)
  const dispatch = useAppDispatch();
  const [openCreateChannel, setOpenCreateChannel] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const handleCloseCreateChannel = () => {
    setOpenCreateChannel(false);
  };

  const filteredFriends = friends.filter((friend: any) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };


  // useEffect(() => {

  //   console.log('hekk');
  //   dispatch(resetFriends());
  //   dispatch(FetchFriends());
  //   // const listFriends = useAppSelector((state) => state.app.friends)
  //   // console.log(listFriends)
  // }, [socket_user]);
  

  const friendsToDisplay = searchQuery ? filteredFriends : friends;

  return (
    <>
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
          <Stack padding={"10px 35px 20px"} spacing={2}>
            <Stack
              direction={"row"}
              alignContent={"center"}
              spacing={3}
              color="#709CE6"
              margin={"auto "}
              display={"block"}
            >
              {/* <ArchiveBox size={35} /> */}
              <Button
                onClick={() => {
                  setOpenCreateChannel(true);
                }}
                startIcon={<PlusCircle size={26} />}
                sx={{
                  width: "100%",
                  fontSize: "18px", // Adjust the font size as needed
                  padding: "10px 38px", // Adjust the padding as needed
                  // neeed to make it center
                  backgroundColor: "#3D3C65", // Change the background color to purple
                  color: "#B7B7C9", // Change the text color to white
                  borderRadius: "18px",
                  "&:hover": {
                    backgroundColor: "#3D3954", // Change the background color on hover
                    color: "#B7B7C9",
                  },
                }}
              >
                Create a New Channel
              </Button>
            </Stack>
            <Divider sx={{ paddingTop: "1px", background: "#3D3C65" }} />
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
            <ScrollBar>
              {
                // ~ ==>  here's where i will do contact <==
              }
              {friendsToDisplay.map((el: any, index: any) => {
                return <ContactElements key={index} {...el} />;
              })}
            </ScrollBar>
          </Stack>
        </Stack>
      </Box>
      {openCreateChannel && (
        <CreateChannel
          open={openCreateChannel}
          handleClose={handleCloseCreateChannel}
        />
      )}
    </>
  );
};

export default Friends;
