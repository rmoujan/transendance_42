import React from "react";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import {
  Chat,
  Prohibit,
  SpeakerSimpleNone,
  SpeakerSimpleSlash,
  UserMinus,
} from "@phosphor-icons/react";
import StyledBadge from "./StyledBadge";
import { useAppDispatch } from "../redux/store/store";
import { mutedContact, selectConversation } from "../redux/slices/contact";

interface State {
  amount: string;
  password: string;
  weight: string;
  weightRange: string;
  muted: boolean;
}

interface Props {
  id: number;
  name: string;
  img: string;
  online: boolean;
}

const ContactElements = (cont: Props) => {
  // const { contact } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const id = cont.id.toString();
  // const selectedChatId = contact.room_id;
  // const isSelected = +selectedChatId === cont.id;

  // if (!selectedChatId) {
  //   isSelected = false;
  // }
  // console.log(contact.room_id, contact.type_chat);

  const [values, setValues] = React.useState<State>({
    amount: "",
    password: "",
    weight: "",
    weightRange: "",
    muted: false,
  });

  const handleClickMuted = () => {
    // ! emit "mute_converstation" event
    // socket.emit("mute_converstation", { to: _id, from: user_id });
    dispatch(mutedContact({room_id: id}))
    
    if (values.muted === true) {
      console.log("unmute");
    } else {
      console.log("mute");
    }
    setValues({
      ...values,
      muted: !values.muted,
    });
  };

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
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        sx={{ padding: "0 8px 14px" }}
      >
        <Stack direction={"row"} alignItems={"center"} spacing={2}>
          {cont.online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
              sx={{ width: 52, height: 52 }}
            >
              <Avatar src={cont.img} sx={{ width: 52, height: 52 }} />
            </StyledBadge>
          ) : (
            <Avatar src={cont.img} sx={{ width: 52, height: 52 }} />
          )}
          <Typography variant="subtitle2" color={"white"}>
            {cont.name}
          </Typography>
        </Stack>
        <Stack direction={"row"} spacing={1}>
          <IconButton
            onClick={() => {

              console.log("Start Converstation");
              // ! emit "start_converstation" event
              dispatch(selectConversation({room_id: id}));
              // socket.emit("start_conversation", { to: _id, from: user_id });
            }}
          >
            <Chat />
          </IconButton>
          <IconButton aria-label="mute contact" onClick={
            handleClickMuted}>
            {values.muted ? <SpeakerSimpleSlash /> : <SpeakerSimpleNone />}
          </IconButton>

          <IconButton
            onClick={() => {
              console.log("Delete Contact");
              // ! emit "delete_contact" event
              // socket.emit("delete_contact", { to: _id, from: user_id });
            }}
          >
            <UserMinus />
          </IconButton>
          <IconButton
            onClick={() => {
              console.log("Block Contact");
              // ! emit "block_contact" event
              // socket.emit("block_contact", { to: _id, from: user_id });
            }}
          >
            <Prohibit />
          </IconButton>
        </Stack>
      </Stack>
      <Divider sx={{ paddingTop: "1px", background: "#684C83" }} />
    </Box>
  );
};

export default ContactElements;