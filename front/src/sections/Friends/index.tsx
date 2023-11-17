import { Box, Button, Divider, Stack } from "@mui/material";
import { MagnifyingGlass, PlusCircle } from "@phosphor-icons/react";
import { useState } from "react";
import ContactElements from "../../components/ContactElements";
import ScrollBar from "../../components/ScrollBar";
import CreateChannel from "../../components/channels/CreateChannel";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/search";
import { ContactList } from "../../data";
import { useAppSelector } from "../../redux/store/store";
// import CreateChannel from "./CreateChannel";

const Friends = () => {
  const [openCreateChannel, setOpenCreateChannel] = useState(false);
  const handleCloseCreateChannel = () => {
    setOpenCreateChannel(false);
  };
  const { friends } = useAppSelector(state => state.app);
  // console.log(friends)

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
                  backgroundColor: "#443263", // Change the background color to purple
                  color: "#C7BBD1", // Change the text color to white
                  borderRadius: "21px",
                  "&:hover": {
                    backgroundColor: "#684C83", // Change the background color on hover
                    color: "#C7BBD1",
                  },
                }}
              >
                Create a New Channel
              </Button>
            </Stack>
            <Divider sx={{ paddingTop: "1px", background: "#684C83" }} />
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
              {friends.map((el, index) => {
                // console.log(el);
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
