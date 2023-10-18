import React from 'react'
import { Box, Stack } from '@mui/material'
import NoChat from '../../sections/NoChat'
import ChatTabs from './ChatTabs'
import Converstation from '../../sections/Converstation'

const ChatGeneral = () => {
    // const { contactInfo } = useSelector((store) => store.app);
    // const dispatch = useDispatch()
  return (
    <Stack direction={"row"} sx={{ width: "100%", height: "90vh" }}>
       <Stack direction={"column"} sx={{
        margin: "42px 21px 42px 42px",
        
        
       }}>
        <ChatTabs />
      </Stack>
      <Stack
        direction={"column"}
        justifyContent={"center"}
        sx={{ borderRadius: "25px" }}
      >
        <Box
          sx={{
            height: "calc(100vh - 72px)",
            width: "calc(100vw - 920px)",
            // backgroundColor: "#3f3b5b91",
            margin: "42px 42px 21px 42px",
            // padding: "42px",
            borderRadius: "64px",
          }}
          className="shadow-2xl bg-gradient-to-tr from-[#2A2742] via-[#3f3a5f] to-[#2A2742]"
        >
          <NoChat />
          
          {/* <Converstation /> */}
        </Box>
      </Stack>

      {/* *** REDUX: if contact info open or not and which part *** */}
      
       {/* {contactInfo.open &&
        (() => {
          switch (contactInfo.type) {
            case "CONTACT":
              return <ContactInfos />;
            case "STARRED":
              return <StarredMsgs />;
            case "SHARED":
              return <SharedMsgs />;
            case "MODIFY":
              return <Profile />;
            default:
              return null;
          }
        })()} */}
    </Stack>
  )
}

export default ChatGeneral