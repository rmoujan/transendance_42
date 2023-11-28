import { Box, Stack } from "@mui/material";
import { useEffect } from "react";
import InfosChannel from "../../components/contactTypes/InfosChannel";
import InfosContact from "../../components/contactTypes/InfosContact";
import { FetchFriends } from "../../redux/slices/app";
import {
  FetchChannels,
  FetchPrivatesChannels,
  FetchProtectedChannels,
  FetchPublicChannels,
} from "../../redux/slices/channels";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";
import Converstation from "../../sections/Converstation";
import NoChat from "../../sections/NoChat";
import ChatTabs from "./ChatTabs";

const ChatGeneral: React.FC = () => {
  const { contact, profile, app, channels } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // console.log(profile._id);
    // if (!profile._id) {
    //   dispatch(FetchProfile());
    // }
    console.log("fetching channels");
    dispatch(FetchProtectedChannels());
    dispatch(FetchPublicChannels());
    dispatch(FetchPrivatesChannels())
    dispatch(FetchChannels());
    dispatch(FetchFriends());
  }, [profile._id]);
  const renderContactInfoComponent = () => {
    if (contact.contactInfos.open) {
      switch (contact.contactInfos.type) {
        case "CONTACT":
          return <InfosContact />;
        case "CHANNEL":
          return <InfosChannel />;
        default:
          return null;
      }
    }
    return null;
  };

  return (
    <Stack direction="row" sx={{ width: "100%", height: "90vh" }}>
      <Stack
        direction="column"
        sx={{
          margin: "42px 21px 42px 42px",
        }}
      >
        <ChatTabs />
      </Stack>
      <Stack
        direction="column"
        justifyContent="center"
        sx={{ borderRadius: "25px" }}
      >
        <Box
          sx={{
            height: "calc(100vh - 172px)",
            width: "calc(100vw - 975px)",
            margin: "42px 42px 21px 42px",
            borderRadius: "64px",
          }}
          className="shadow-2xl bg-gradient-to-tr from-[#2A2742] via-[#3f3a5f] to-[#2A2742]"
        >
          {contact.type_chat !== "" && contact.room_id.toString() !== "" ? (
            <Converstation />
          ) : (
            <NoChat />
          )}
        </Box>
      </Stack>

      {renderContactInfoComponent()}
    </Stack>
  );
};

export default ChatGeneral;
