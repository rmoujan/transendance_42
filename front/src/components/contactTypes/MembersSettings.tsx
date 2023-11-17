import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Gavel,
  SpeakerSimpleNone,
  SpeakerSimpleSlash,
  UserGear,
  UserMinus,
  UserPlus,
} from "@phosphor-icons/react";
import { useAppSelector } from "../../redux/store/store";
import { socket } from "../../socket";
import axios from "axios";

const MembersSettings = (el: any) => {
  const { _id } = useAppSelector(state => state.profile);
  const { user } = el.el;
  console.log(_id, user);
  const [owner, setOwner] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [member, setMember] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setOwner(user.userId === _id && user.status_UserInChannel === "owner");
    setAdmin(user.userId === _id && user.status_UserInChannel === "admin");
    setMember(user.userId === _id && user.status_UserInChannel === "member");
    console.log(el.el, owner);
  }, [user, _id]);

  const friendRequest = () => {
    console.log("friend request");
    // ! emit "friend_request" event

    // socket.emit("friend_request", { to: _id, from: user_id });
    // dispatch(updatedContactInfo({ friend_request: true }));
  };
  const makeAdmin = () => {
    console.log("make admin");
    // ! emit "make_admin" event
    axios.post("http://localhost:3000/channels/setAdmin", {
      to: _id,
      from: user.userId,
      channel_id: el.el.channelId,
    });

    // socket.emit("make_admin", { to: el.el.userId, from: _id });
    // dispatch(updatedContactInfo({ admin: true }));
  };
  const handleClickMuted = () => {
    // ! emit "mute_converstation" event

    // socket.emit("mute_converstation", { to: _id, from: user_id });
    // dispatch(mutedContact({ room_id: id }));

    if (muted === true) {
      console.log("unmute");
      socket.emit("unmuteUserFromChannel", {
        to: _id,
        from: user.userId,
        channel_id: el.el.channelId,
      });
    } else {
      console.log("mute");
      socket.emit("muteUserFromChannel", {
        to: _id,
        from: user.userId,
        channel_id: el.el.channelId,
      });
    }
    setMuted(() => !muted);
  };
  return (
    <Box
      sx={{
        width: 520,
        padding: "25px 25px",
        margin: "1px",
        borderRadius: "15px",
        backgroundColor: "#806EA9",
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Stack direction={"row"} alignItems={"center"} spacing={1}>
          <Avatar src={user.avatar} sx={{ width: 52, height: 52 }} />
          <Typography variant="h5" color={"#322554"} sx={{ padding: 0 }}>
            {user.name}
          </Typography>
        </Stack>
        {!(_id === el.el.userId) && (
          <Stack direction={"row"} alignItems={"center"} spacing={1}>
            {/* {console.log(el)} */}

            {el.el.status_UserInChannel === "member" &&
              el.el.status_UserInChannel !== "owner" && (
                <Box
                  sx={{
                    width: "50px",
                    padding: "5px",
                    borderRadius: "15px",
                    backgroundColor: "#806149",
                  }}
                >
                  <Tooltip title="Make admin">
                    <IconButton aria-label="friend request" onClick={makeAdmin}>
                      <UserGear />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}

            {el.el.status_UserInChannel !== "member" &&
              el.el.status_UserInChannel !== "owner" && (
                <Box
                  sx={{
                    width: "50px",
                    padding: "5px",
                    borderRadius: "15px",
                    backgroundColor: "#806149",
                  }}
                >
                  <Tooltip title="Send Friend Request">
                    <IconButton
                      aria-label="friend request"
                      onClick={friendRequest}
                    >
                      <UserPlus />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}

            <Box
              sx={{
                width: "50px",
                padding: "5px",
                borderRadius: "15px",
                backgroundColor: "#806149",
              }}
            >
              <Tooltip title="Mute">
                <IconButton
                  aria-label="mute contact"
                  onClick={handleClickMuted}
                >
                  {muted ? <SpeakerSimpleSlash /> : <SpeakerSimpleNone />}
                </IconButton>
              </Tooltip>
            </Box>

            {el.el.status_UserInChannel === "member" && (
              <Box
                sx={{
                  width: "50px",
                  padding: "5px",
                  borderRadius: "15px",
                  backgroundColor: "#806149",
                }}
              >
                <Tooltip title="Kick">
                  <IconButton
                    onClick={() => {
                      console.log("kick Contact");
                      // ! emit "kick_contact" event
                      socket.emit("kickUserFromChannel", {
                        to: el.el.userId,
                        from: _id,
                        channel_id: el.el.channelId,
                      });
                      // socket.emit("delete_contact", { to: el.el.userId, from: _id });
                    }}
                  >
                    <UserMinus />
                  </IconButton>
                </Tooltip>
              </Box>
            )}

            {el.el.status_UserInChannel === "member" && (
              <Box
                sx={{
                  width: "50px",
                  padding: "5px",
                  borderRadius: "15px",
                  backgroundColor: "#806149",
                }}
              >
                <Tooltip title="Ban">
                  <IconButton
                    onClick={() => {
                      console.log("Ban User");
                      socket.emit("banUserFRomChannel", {
                        to: el.el.userId,
                        from: _id,
                        channel_id: el.el.channelId,
                      });
                      // ! emit "ban_contact" event
                      // socket.emit("block_contact", { to: el.el.userId, from: _id });
                    }}
                  >
                    <Gavel />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default MembersSettings;
