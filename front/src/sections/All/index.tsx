import { Box, Stack } from '@mui/material';
import React, { useEffect } from 'react'
import { Search, SearchIconWrapper, StyledInputBase } from '../../components/search';
import { MagnifyingGlass } from '@phosphor-icons/react';
import ChatElements from '../../components/ChatElements';
import { ChatList } from '../../data';
// import { socket } from '../../socket'

const All = () => {

  useEffect(() => {
    // emit socket
  }, [])
  
  return (
    <Box
      sx={{
        position: "relative",
        width: 452,
        // backgroundColor: "#806EA9",
        // boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        margin: "0 18px 18px",
        borderRadius: "25px",
      }}
    >
      <Stack sx={{ height: "calc(100vh - 320px)" }}>
        <Stack padding={1} sx={{ width: "100%" }}>
          <Search>
            <SearchIconWrapper>
              <MagnifyingGlass /> {/* SVG */}
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
        </Stack>
        <Stack
          direction={"column"}
          sx={{
            flexGrow: 1, overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "0.4em",
            }, height: "100%"
          }}
        >
          <Stack>
            {ChatList.filter((el) => !el.pinned).map((el) => {
              return <ChatElements {...el} />;
            })}
          </Stack>
        </Stack>
      </Stack>
    </Box>
  )
}

export default All