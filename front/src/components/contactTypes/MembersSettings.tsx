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
import { useAppDispatch, useAppSelector } from "../../redux/store/store";
import { socket } from "../../socket";
import axios from "axios";
import { FetchChannels } from "../../redux/slices/channels";
import { toggleDialog } from "../../redux/slices/contact";

const MembersSettings = (el: any) => {
  const { _id } = useAppSelector(state => state.profile);
  const {friends} = useAppSelector(state => state.app);
  // console.log('**************************')
  // console.log(_id, friends, el.el.userId);
  // console.log('**************************')
  const dispatch = useAppDispatch();
  const { user } = el.el;
  // console.log(el.isOwner);
  // console.log(el.isAdmin);
  // console.log(el.isMember);
  // console.log(el.el);

  // console.log(_id, user);
  const [friend, setFriend] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
   
    // console.log(el.el, owner);
    // check friends is true or false using el.el.userId
    if (friends.length > 0 && el.el.userId !== _id) {
      const isFriend = friends.some((friend: any) => {
        return friend.id_user === el.el.userId;
      });
      // console.log(isFriend);
      setFriend(isFriend);
    }
  }, [user, _id, el]);

  const friendRequest = () => {
    console.log("friend request");
    // ! emit "friend_request" event

    // socket.emit("friend_request", { to: _id, from: user_id });
    // dispatch(updatedContactInfo({ friend_request: true }));
  };
  const makeAdmin = () => {
    // console.log("make admin");
    // console.log(user.id_user, _id, el.el.channelId)
    // ! emit "make_admin" event
    axios.post("http://localhost:3000/channels/setAdmin", {
      to: user.id_user,
      from: _id,
      channel_id: el.el.channelId,
    });
    dispatch(FetchChannels());
    dispatch(toggleDialog())
    // ! dispatch "updatedChannels" action
  };
  const handleClickMuted = () => {
    // ! emit "mute_converstation" event

    if (muted === true) {
      console.log("unmute");
      socket.emit("unmuteUserFromChannel", {
        to: user.id_user,
        from: _id,
        channel_id: el.el.channelId,
      });
    } else {
      console.log("mute");
      socket.emit("muteUserFromChannel", {
        to: user.id_user,
        from: _id,
        channel_id: el.el.channelId,
      });
    }
    socket.on("ResponsekickUser", (data: any) => {
      console.log(data);
    });
    setMuted(() => !muted);
  };

  return (
    <Box
      sx={{
        width: 520,
        padding: "25px 25px",
        margin: "1px",
        borderRadius: "15px",
        backgroundColor: (_id === el.el.userId) ? "#DC5833" : "#696693",
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
            {(el.isOwner) && el.el.status_UserInChannel === "member" &&
              el.el.status_UserInChannel !== "admin" && (
                <Box
                  sx={{
                    width: "50px",
                    padding: "5px",
                    borderRadius: "15px",
                    backgroundColor: "#3D3C65",
                  }}
                >
                  <Tooltip title="Make admin">
                    <IconButton aria-label="friend request" onClick={makeAdmin}>
                      <UserGear color="#FE754D"/>
                    </IconButton>
                  </Tooltip>
                </Box>
              )}

            { !friend && (
                <Box
                  sx={{
                    width: "50px",
                    padding: "5px",
                    borderRadius: "15px",
                    backgroundColor: "#3D3C65",
                  }}
                >
                  <Tooltip title="Send Friend Request">
                    <IconButton
                      aria-label="friend request"
                      onClick={friendRequest}
                    >
                      <UserPlus color="#FE754D"/>
                    </IconButton>
                  </Tooltip>
                </Box>
              )}

            {(el.isAdmin || el.isOwner) && el.el.status_UserInChannel !== "owner" && <Box
              sx={{
                width: "50px",
                padding: "5px",
                borderRadius: "15px",
                backgroundColor: "#3D3C65",
              }}
            >
              <Tooltip title="Mute">
                <IconButton
                  aria-label="mute contact"
                  onClick={handleClickMuted}
                >
                  {muted ? <SpeakerSimpleSlash color="#FE754D"/> : <SpeakerSimpleNone color="#FE754D"/>}
                </IconButton>
              </Tooltip>
            </Box>}

            {(el.isAdmin || el.isOwner) && el.el.status_UserInChannel === "member" && (
              <Box
                sx={{
                  width: "50px",
                  padding: "5px",
                  borderRadius: "15px",
                  backgroundColor: "#3D3C65",
                }}
              >
                <Tooltip title="Kick">
                  <IconButton
                    onClick={() => {
                      console.log("kick Contact");
                      // ! emit "kick_contact" event
                      socket.emit("kickUserFromChannel", {
                        to: user.id_user,
                        from: _id,
                        channel_id: el.el.channelId,
                      });
                      // socket.emit("delete_contact", { to: el.el.userId, from: _id });
                    }}
                  >
                    <UserMinus color="#FE754D"/>
                  </IconButton>
                </Tooltip>
              </Box>
            )}

            {(el.isAdmin || el.isOwner) && el.el.status_UserInChannel === "member" && (
              <Box
                sx={{
                  width: "50px",
                  padding: "5px",
                  borderRadius: "15px",
                  backgroundColor: "#3D3C65",
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
                    }}
                  >
                    <Gavel color="#FE754D"/>
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
