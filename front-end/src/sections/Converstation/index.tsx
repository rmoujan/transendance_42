import React from "react";
import {
  Box,
  Stack,
} from "@mui/material";
import Header from "../../components/converstation/Header";
import Messages from "../../components/converstation/Messages";
import Chatbox from "../../components/converstation/Chatbox";


const Converstation = () => {
  return (
    <Stack height={"100%"} maxHeight={"100vh"} width={"auto"} className="shadow-2xl" sx={{
      borderRadius: "22px",
      backgroundColor: "#806EA9",
    }}>
      {/* header chat */}
      <Header/>
      {/* messaging */}
      <Box width={"100%"} sx={{flexGrow:1, height: "100%", overflowY:"scroll"}}>
        <Messages />
      </Box>
     
      {/* typing */}
      <Chatbox />
     
    </Stack>
  );
};

export default Converstation;
