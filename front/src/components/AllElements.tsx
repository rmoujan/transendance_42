import { Avatar, Badge, Box, Stack, Typography, styled } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../redux/store/store";
import StyledBadge from "./StyledBadge";
import {
  selectConversation,
  updatedContactInfo,
} from "../redux/slices/contact";

const StyledChatBox = styled(Box)(() => ({
  "&:hover": {
    cursor: "pointer",
  },
}));

const AllElements = (el: any) => {
  const { contact, profile } = useAppSelector(state => state);
  const dispatch = useAppDispatch();
  const selected_id = el.room_id;
  const selectedChatId = contact.room_id;
  let isSelected = +selectedChatId === parseInt(selected_id);

  if (!selectedChatId) {
    isSelected = false;
  }
  return (
    <StyledChatBox
      onClick={() => {
        // console.log(el.channel_type);
        // console.log(selected_id, el.name, el.img);
        el.channel_type === "direct"
          ? dispatch(updatedContactInfo("CONTACT"))
          : dispatch(updatedContactInfo("CHANNEL"));

        dispatch(
          selectConversation({
            room_id: selected_id,
            name: el.name,
            type_chat:
              el.channel_type === "direct" ? "individual" : el.channel_type,
            avatar: el.img,
          })
        );
        // dispatch(updatedContactInfo("CONTACT"));
        // console.log(id);
        // dispatch(
        //   selectConversation({
        //     room_id: selected_id,
        //     name: id.name,
        //     type_chat: "individual",
        //     avatar: id.img,
        //   })
        // );
      }}
      sx={{
        width: "100%",
        height: 85,
        backgroundColor: isSelected ? "#FE754D" : "transparent",
        borderRadius: "15px",
      }}
      p={2}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        sx={{ padding: "0 8px 0 4px" }}
      >
        <Stack direction={"row"} alignItems={"center"} spacing={2}>
          {el.online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar src={el.img} sx={{ width: 52, height: 52 }} />
            </StyledBadge>
          ) : (
            <Avatar src={el.img} sx={{ width: 52, height: 52 }} />
          )}
          <Stack spacing={1.3}>
            <Typography variant="subtitle2" color={"white"}>
              {el.name}
            </Typography>
            <Typography
              variant="caption"
              color={"white"}
              sx={{ fontWeight: 400 }}
            >
              {el.msg}
            </Typography>
          </Stack>
        </Stack>
        <Stack spacing={2} alignItems={"center"}>
          <Typography
            sx={{ fontWeight: 600, paddingBottom: "10px", paddingTop: 0 }}
            variant="caption"
          >
            {el.time}
          </Typography>
          <Badge
            color="primary"
            badgeContent={el.unread}
            sx={{ paddingBottom: "9px", paddingTop: 0 }}
          ></Badge>
        </Stack>
      </Stack>
    </StyledChatBox>
  );
};

export default AllElements;
