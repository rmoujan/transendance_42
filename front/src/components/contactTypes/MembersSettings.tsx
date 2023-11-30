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
import axios from "axios";
import { FetchFriends } from "../../redux/slices/app";
import {
  FetchChannels,
  FetchPrivatesChannels,
  FetchProtectedChannels,
  FetchPublicChannels,
} from "../../redux/slices/channels";
import {
  resetContact,
  showSnackbar,
  toggleDialog,
} from "../../redux/slices/contact";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";
import { socket, socket_user } from "../../socket";

const MembersSettings = (el: any) => {
  const { _id } = useAppSelector((state) => state.profile);
  const { friends } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();
  const { user } = el.el;

  const [friend, setFriend] = useState(false);

  useEffect(() => {
    if (friends.length > 0 && el.el.userId !== _id) {
      const isFriend = friends.some((friend: any) => {
        return friend.id_user === el.el.userId;
      });
      setFriend(isFriend);
    }
  }, [user, _id, el]);

  const friendRequest = () => {
    const id_user = el.el.userId;
    socket_user.emit("add-friend", { id_user });
    dispatch(FetchFriends());
    dispatch(toggleDialog());
    dispatch(resetContact());
    dispatch(
      showSnackbar({
        severity: "success",
        message: `${el.el.user.name} has been deleted`,
      })
    );
  };
  const makeAdmin = async () => {
    const res = await axios.post("http://localhost:3000/channels/setAdmin", {
      to: user.id_user,
      from: _id,
      channel_id: el.el.channelId,
    });
    if (res.data === true) {
      dispatch(toggleDialog());
      dispatch(FetchChannels());
      dispatch(FetchProtectedChannels());
      dispatch(FetchPublicChannels());
      dispatch(FetchPrivatesChannels());
      dispatch(resetContact());
      dispatch(
        showSnackbar({
          severity: "success",
          message: `You have make ${el.el.user.name} admin successfully`,
        })
      );
    } else {
      dispatch(
        showSnackbar({
          severity: "error",
          message: `You haven't make ${el.el.user.name} admin of this channel`,
        })
      );
    }

  };

  const handlekick = () => {
    socket.emit("kickUserFromChannel", {
      to: user.id_user,
      from: _id,
      channel_id: el.el.channelId,
    });

    socket.on("ResponsekickUser", (data: any) => {
      if (data == true) {
        dispatch(toggleDialog());
        dispatch(FetchChannels());
        dispatch(FetchProtectedChannels());
        dispatch(FetchPublicChannels());
        dispatch(FetchPrivatesChannels());
        dispatch(resetContact());
        dispatch(
          showSnackbar({
            severity: "success",
            message: `You have kick ${el.el.user.name} successfully`,
          })
        );
      } else {
        dispatch(
          showSnackbar({
            severity: "error",
            message: `You haven't kick ${el.el.user.name}`,
          })
        );
      }
    });
  };
  const handleBan = () => {
    socket.emit("banUserFRomChannel", {
      to: el.el.userId,
      from: _id,
      channel_id: el.el.channelId,
    });
    socket.on("ResponseBannedUser", (data: any) => {
      if (data == true) {
        dispatch(toggleDialog());
        dispatch(FetchChannels());
        dispatch(FetchProtectedChannels());
        dispatch(FetchPublicChannels());
        dispatch(FetchPrivatesChannels());
        dispatch(resetContact());
        dispatch(
          showSnackbar({
            severity: "success",
            message: `You have Ban ${el.el.user.name} successfully`,
          })
        );
      } else {
        dispatch(
          showSnackbar({
            severity: "error",
            message: `You haven't Ban ${el.el.user.name}`,
          })
        );
      }
    });
  };
  const handleClickMuted = () => {
    if (el.el.muted === true) {
      socket.emit("unmuteUserFromChannel", {
        to: user.id_user,
        from: _id,
        channel_id: el.el.channelId,
      });
    } else {
      socket.emit("muteUserFromChannel", {
        to: user.id_user,
        from: _id,
        channel_id: el.el.channelId,
      });
    }
    socket.on("ResponsunmutekUser", (data: any) => {
      if (data == true) {
        dispatch(toggleDialog());
        dispatch(FetchChannels());
        dispatch(FetchProtectedChannels());
        dispatch(FetchPublicChannels());
        dispatch(FetchPrivatesChannels());
        dispatch(resetContact());
        dispatch(
          showSnackbar({
            severity: "success",
            message: `You have unmuted ${el.el.user.name} successfully`,
          })
        );
      } else {
        dispatch(
          showSnackbar({
            severity: "error",
            message: `You haven't muted ${el.el.user.name}`,
          })
        );
      }
    });
    socket.on("ResponsemuteUser", (data: any) => {
      if (data == true) {
        dispatch(toggleDialog());
        dispatch(FetchChannels());
        dispatch(FetchProtectedChannels());
        dispatch(FetchPublicChannels());
        dispatch(FetchPrivatesChannels());
        dispatch(resetContact());
        dispatch(
          showSnackbar({
            severity: "success",
            message: `You have muted ${el.el.user.name} successfully`,
          })
        );
      } else {
        dispatch(
          showSnackbar({
            severity: "error",
            message: `You haven't muted ${el.el.user.name}`,
          })
        );
      }
    });

  };

  return (
    <Box
      sx={{
        width: 520,
        padding: "25px 25px",
        margin: "1px",
        borderRadius: "15px",
        backgroundColor: _id === el.el.userId ? "#DC5833" : "#696693",
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
            {el.isOwner &&
              el.el.status_UserInChannel === "member" &&
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
                      <UserGear color="#FE754D" />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}

            {!friend && (
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
                    <UserPlus color="#FE754D" />
                  </IconButton>
                </Tooltip>
              </Box>
            )}

            {(el.isAdmin || el.isOwner) &&
              el.el.status_UserInChannel !== "owner" && (
                <Box
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
                      {el.el.muted ? (
                        <SpeakerSimpleSlash color="#FE754D" />
                      ) : (
                        <SpeakerSimpleNone color="#FE754D" />
                      )}
                    </IconButton>
                  </Tooltip>
                </Box>
              )}

            {(el.isAdmin || el.isOwner) &&
              el.el.status_UserInChannel === "member" && (
                <Box
                  sx={{
                    width: "50px",
                    padding: "5px",
                    borderRadius: "15px",
                    backgroundColor: "#3D3C65",
                  }}
                >
                  <Tooltip title="Kick">
                    <IconButton onClick={handlekick}>
                      <UserMinus color="#FE754D" />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}

            {(el.isAdmin || el.isOwner) &&
              el.el.status_UserInChannel === "member" && (
                <Box
                  sx={{
                    width: "50px",
                    padding: "5px",
                    borderRadius: "15px",
                    backgroundColor: "#3D3C65",
                  }}
                >
                  <Tooltip title="Ban">
                    <IconButton onClick={handleBan}>
                      <Gavel color="#FE754D" />
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
