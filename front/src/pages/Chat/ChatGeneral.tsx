import { Box, Stack } from "@mui/material";
import InfosContact from "../../components/contactTypes/InfosContact";
import SharedMsgs from "../../components/contactTypes/SharedMsgs";
import StarredMsgs from "../../components/contactTypes/StarredMsgs";
import { useAppSelector } from "../../redux/store/store";
import Converstation from "../../sections/Converstation";
import NoChat from "../../sections/NoChat";
import ChatTabs from "./ChatTabs";
import { useEffect } from "react";
import axios from "axios";
import InfosChannel from "../../components/contactTypes/infosChannel";

const ChatGeneral: React.FC = () => {
  const { contact, profile } = useAppSelector(state => state);

  useEffect(() => {
    // console.log('chat general', contact.room_id, contact.type_chat);
    //   function axiosTest() {
    //     console.log(contact.room_id)
    //     // create a promise for the axios request
    //     const promise = axios.get(`http://localhost:3000/chatData/${contact.room_id}`, {
    //       params: {
    //         id: contact.room_id,
    //       },
    //       withCredentials: true,
    //     })
    //     // using .then, create a new promise which extracts the data
    //     const dataPromise = promise.then((response) => response.data)
    //     // return it
    //     return dataPromise
    // }
    // axiosTest()
    // .then(data => {
    //   console.log(data)
    //     Response.json({ message: 'Request received!', data })
    // })
    // .catch(err => console.log(err))
  }, []);
  const renderContactInfoComponent = () => {
    if (contact.contactInfos.open) {
      switch (contact.contactInfos.type) {
        case "CONTACT":
          return <InfosContact />;
        case "STARRED":
          return <StarredMsgs />;
        case "SHARED":
          return <SharedMsgs />;
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
