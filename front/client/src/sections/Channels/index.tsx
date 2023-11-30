import { Box, Button, Divider, Stack } from "@mui/material";
import { MagnifyingGlass, PlusCircle } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import ChannelElements from "../../components/ChannelsElements";
import CreateChannel from "../../components/channels/CreateChannel";
import JoinChannel from "../../components/channels/JoinChannel";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/search";
import { FetchChannels } from "../../redux/slices/channels";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";

const Channels = () => {
  const [openCreateChannel, setOpenCreateChannel] = useState(false);
  const [openJoinChannel, setOpenJoinChannel] = useState(false);
  const { channels, current_messages } = useAppSelector((state) => state.channels);
  const {profile} = useAppSelector((state) => state)
  const dispatch = useAppDispatch();

  // this is will close join channel modal
  const handleCloseJoinChannel = () => {
    setOpenJoinChannel(false);
  };
  // this is will close join channel modal
  const handleCloseCreateChannel = () => {
    setOpenCreateChannel(false);
  };

  useEffect(() => {
    dispatch(FetchChannels());
  }, [profile._id, current_messages]);
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
          <Stack
            justifyContent={"space-between"}
            padding={"10px 15px 20px"}
            spacing={2}
          >
            <Stack
              direction={"row"}
              alignContent={"center"}
              spacing={3}
              color="#709CE6"
              // margin={"auto"}
              display={"block"}
            >
              <Button
                onClick={() => {
                  setOpenCreateChannel(true);
                }}
                startIcon={<PlusCircle size={26} />}
                sx={{
                  fontSize: "18px", 
                  padding: "10px 17px",
                  backgroundColor: "#3D3C65",
                  color: "#B7B7C9",
                  borderRadius: "18px",
                  "&:hover": {
                    backgroundColor: "#3D3954",
                    color: "#B7B7C9",
                  },
                }}
                variant="contained"
              >
                New Channel
              </Button>
              <Button
                onClick={() => {
                  setOpenJoinChannel(true);
                }}
                startIcon={<PlusCircle size={26} />}
                sx={{
                  fontSize: "18px",
                  padding: "10px 17px",
                  backgroundColor: "#3D3C65",
                  color: "#B7B7C9",
                  borderRadius: "18px",
                  "&:hover": {
                    backgroundColor: "#3D3954",
                    color: "#B7B7C9",
                  },
                }}
                variant="contained"
              >
                Join Channel
              </Button>
            </Stack>
            <Divider sx={{ background: "#3D3954" }} />
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
            {channels.map((el: any, index) => {
              return <ChannelElements key={index} {...el} />;
            })}
          </Stack>
        </Stack>
      </Box>
      {openJoinChannel && (
        <JoinChannel
          open={openJoinChannel}
          handleClose={handleCloseJoinChannel}
        />
      )}
      {openCreateChannel && (
        <CreateChannel
          open={openCreateChannel}
          handleClose={handleCloseCreateChannel}
          el={null}
        />
      )}
    </>
  );
};

export default Channels;
