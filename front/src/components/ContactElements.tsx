import React, { useEffect } from "react";
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
import {
  mutedContact,
  selectConversation,
  updatedContactInfo,
} from "../redux/slices/contact";
import {
  emptyConverstation,
  setCurrentConverstation,
} from "../redux/slices/converstation";
import { useAppDispatch, useAppSelector } from "../redux/store/store";
import { socket } from "../socket";
import StyledBadge from "./StyledBadge";

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

const ContactElements = (cont: any) => {
  const { conversations } = useAppSelector(
    state => state.converstation.direct_chat
  );
  // console.log(cont);
  const { contact, profile } = useAppSelector(state => state);
  // console.log(contact);
  const dispatch = useAppDispatch();
  const id = cont.id_user;

  // console.log(id);
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
    dispatch(mutedContact({ room_id: id }));

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

  useEffect(() => {
    const handleHistoryDms = (data: any) => {
      // console.log("data", data);
      if (data.length === 0 || !data[0]) {
        // console.log("empty");
        dispatch(emptyConverstation());
      } else {
        dispatch(
          setCurrentConverstation({
            data,
            user_id: profile._id,
            room_id: contact.room_id,
          })
        );
      }
    };

    if (!contact.room_id) return;
    socket.emit("allMessagesDm", {
      room_id: contact.room_id, // selected conversation
      user_id: profile._id, // current user
    });
    socket.on("historyDms", handleHistoryDms);

    return () => {
      socket.off("historyDms", handleHistoryDms);
    };
  }, [contact.room_id, profile._id, dispatch]);
  return (
    <Box
      sx={{
        width: "100%",
        height: 85,
        borderRadius: "1",
        // backgroundColor: "#806EA9",
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
          {cont.status_user === "online" ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
              sx={{ width: 52, height: 52 }}
            >
              <Avatar src={cont.avatar} sx={{ width: 52, height: 52 }} />
            </StyledBadge>
          ) : (
            <Avatar src={cont.avatar} sx={{ width: 52, height: 52 }} />
          )}
          <Typography variant="subtitle2" color={"white"}>
            {cont.name}
          </Typography>
        </Stack>
        <Stack direction={"row"} spacing={1}>
          <IconButton
            onClick={() => {
              // ! emit "start_converstation" event

              // console.log("start_converstation", id);
              console.log(conversations);
              dispatch(updatedContactInfo("CONTACT"));
              dispatch(
                selectConversation({
                  room_id: id,
                  name: cont.name,
                  avatar: cont.avatar,
                  type_chat: "individual",
                })
              );
            }}
          >
            <Chat />
          </IconButton>
          <IconButton aria-label="mute contact" onClick={handleClickMuted}>
            {values.muted ? <SpeakerSimpleSlash /> : <SpeakerSimpleNone />}
          </IconButton>

          <IconButton
            onClick={() => {
              console.log("Delete Contact");
              // !  "delete_contact"
            }}
          >
            <UserMinus />
          </IconButton>
          <IconButton
            onClick={() => {
              console.log("Block Contact");
              // !  "block_contact"
            }}
          >
            <Prohibit />
          </IconButton>
        </Stack>
      </Stack>
      <Divider sx={{ background: "#3D3C65" }} />
    </Box>
  );
};

export default ContactElements;
