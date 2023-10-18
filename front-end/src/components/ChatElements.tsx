import { Avatar, Badge, Box, Stack, Typography } from "@mui/material";
import StyledBadge from "./StyledBadge";


interface IdType  {
  id: number;
  name: string;
  img: string;
  time: string;
  msg: string;
  unread: number;
  online: boolean;
}

const ChatElements = (id: IdType) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: 85,
        borderRadius: "1",
        backgroundColor: "#806EA9",
      }}
      p={2}
    >
      {/* {console.log(id.img)} */}
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        sx={{ padding: "0 8px 0 4px" }}
        // margin={"0 0 0 4px"}
      >
        <Stack direction={"row"} alignItems={"center"} spacing={2}>
          {id.online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
              sx={{ width: 52, height: 52 }}
            >
              <Avatar src={id.img} sx={{ width: 52, height: 52 }} />
            </StyledBadge>
          ) : (
            <Avatar src={id.img} sx={{ width: 52, height: 52 }} />
          )}
          <Stack spacing={1.3}>
            <Typography variant="subtitle2" color={"white"}>
              {id.name}
            </Typography>
            <Typography
              variant="caption"
              color={"white"}
              sx={{ fontWeight: 400 }}
            >
              {id.msg}
            </Typography>
          </Stack>
        </Stack>
        <Stack spacing={2} alignItems={"center"}>
          <Typography
            sx={{ fontWeight: 600, paddingBottom: "10px", paddingTop: 0 }}
            variant="caption"
          >
            {id.time}
            {/* 10:45 PM */}
          </Typography>
          <Badge
            color="primary"
            badgeContent={id.unread}
            sx={{ paddingBottom: "9px", paddingTop: 0 }}
          ></Badge>
        </Stack>
      </Stack>
    </Box>
  );
};


export default ChatElements;