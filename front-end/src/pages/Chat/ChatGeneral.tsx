import { Box, Stack } from "@mui/material";
import InfosContact from "../../components/contactTypes/InfosContact";
import SharedMsgs from "../../components/contactTypes/SharedMsgs";
import StarredMsgs from "../../components/contactTypes/StarredMsgs";
import { useAppSelector } from "../../redux/store/store";
import Converstation from "../../sections/Converstation";
import NoChat from "../../sections/NoChat";
import ChatTabs from "./ChatTabs";

const ChatGeneral: React.FC = () => {
  const { contact, profile } = useAppSelector(state => state);

  const renderContactInfoComponent = () => {
    if (contact.contactInfos.open) {
      switch (contact.contactInfos.type) {
        case "CONTACT":
          return <InfosContact />;
        case "STARRED":
          return <StarredMsgs />;
        case "SHARED":
          return <SharedMsgs />;
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
          {contact.type_chat === "individual" && contact.room_id.toString() !== "" ? (
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
