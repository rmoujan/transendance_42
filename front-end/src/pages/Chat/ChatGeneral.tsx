import React from "react";
import { Box, Stack } from "@mui/material";
import NoChat from "../../sections/NoChat";
import ChatTabs from "./ChatTabs";
import Converstation from "../../sections/Converstation";
import InfosContact from "../../components/contactTypes/InfosContact";
import StarredMsgs from "../../components/contactTypes/StarredMsgs";
import SharedMsgs from "../../components/contactTypes/SharedMsgs";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";

const ChatGeneral = () => {
  const { contact } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  console.log(contact.contactInfos);

  return (
    <Stack direction={"row"} sx={{ width: "100%", height: "90vh" }}>
      <Stack
        direction={"column"}
        sx={{
          margin: "42px 21px 42px 42px",
        }}
      >
        <ChatTabs />
      </Stack>
      <Stack
        direction={"column"}
        justifyContent={"center"}
        sx={{ borderRadius: "25px" }}
      >
        <Box
          sx={{
            height: "calc(100vh - 172px)",
            width: "calc(100vw - 975px)",
            // backgroundColor: "#3f3b5b91",
            margin: "42px 42px 21px 42px",
            // padding: "42px",
            borderRadius: "64px",
          }}
          className="shadow-2xl bg-gradient-to-tr from-[#2A2742] via-[#3f3a5f] to-[#2A2742]"
        >
          {contact.type_chat === "individual" && contact.room_id !== "" ? (
            <Converstation />
          ) : (
            <NoChat />
          )}
          {/* hello */}
        </Box>
      </Stack>

      {/* *** REDUX: if contact info open or not and which part *** */}

      {contact.contactInfos.open &&
        (() => {
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
        })()}
    </Stack>
  );
};

export default ChatGeneral;
