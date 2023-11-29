import { Avatar, Box, Stack, Typography, styled } from "@mui/material";
import { useEffect } from "react";
import {
  selectConversation,
  updatedContactInfo,
} from "../redux/slices/contact";
import { setCurrentConverstation } from "../redux/slices/converstation";
import { useAppDispatch, useAppSelector } from "../redux/store/store";
import { socket } from "../socket";

const StyledChatBox = styled(Box)(() => ({
  "&:hover": {
    cursor: "pointer",
  },
}));

const AllElements = (el: any) => {
  console.log(el)
  const { contact, profile } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const selected_id = el.room_id;
  const selectedChatId = contact.room_id;
  let isSelected = +selectedChatId === parseInt(selected_id);

  if (!selectedChatId) {
    isSelected = false;
  }

  useEffect(() => {
    const handleHistoryDms = (data: any) => {
      dispatch(setCurrentConverstation({ data, user_id: profile._id }));
    };
    if (!contact.room_id) return;
    socket.emit("allMessagesDm", {
      room_id: contact.room_id, // selected conversation
      user_id: profile._id, // current user
    });
    socket.once("historyDms", handleHistoryDms);

    return () => {
      socket.off("historyDms", handleHistoryDms);
    };
  }, [contact.room_id, profile._id, dispatch]);

  return (
    <StyledChatBox
      onClick={() => {

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
          <Avatar src={el.img} sx={{ width: 52, height: 52 }} />

          <Stack spacing={1.3}>
            <Typography variant="subtitle2" color={"white"}>
              {el.name}
            </Typography>
            <Typography
              variant="caption"
              color={"white"}
              sx={{ fontWeight: 400 }}
            >
              {el.msg
                ? el.msg.length > 45
                  ? el.msg.substring(0, 45) + "..."
                  : el.msg
                : "There is no message yet"}
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
        </Stack>
      </Stack>
    </StyledChatBox>
  );
};

export default AllElements;