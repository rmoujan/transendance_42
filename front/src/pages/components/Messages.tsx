import { useEffect } from "react";
import {
  FetchChannels,
  FetchProtectedChannels,
  FetchPublicChannels,
} from "../../redux/slices/channels";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";
import { connectSocket, socket } from "../../socket";
import ChatGeneral from "../Chat/ChatGeneral";

function Messages() {
  const { profile, converstation, contact } = useAppSelector(state => state);
  const dispatch = useAppDispatch();
  // dispatch(resetContact());

  // dispatch(FetchChannels());
  // dispatch(FetchProtectedChannels());
  // dispatch(FetchPublicChannels());
  useEffect(() => {
    if (!socket) {
      // console.log("socket not found");
      connectSocket(profile._id.toString());
      console.log("socket connected", profile._id);
    }
  }, [profile, socket, converstation]);

  return (
    <div>
      <ChatGeneral />
    </div>
  );
}

export default Messages;
