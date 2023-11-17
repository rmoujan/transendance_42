import { useEffect } from "react";
import ChatGeneral from "../Chat/ChatGeneral";
import { connectSocket, socket } from "../../socket";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";
import { FetchFriends } from "../../redux/slices/app";


function Messages() {
  const { profile, converstation, contact } = useAppSelector(state => state);
  const dispatch = useAppDispatch();
  dispatch(FetchFriends());
  // dispatch(FetchChannels());
  // dispatch(FetchProtectedChannels());
  // dispatch(FetchPublicChannels());
  useEffect(() => {
    if (!socket) {
      // console.log("socket not found");
      connectSocket(profile._id.toString());
      console.log("socket connected", profile._id);

}}, [profile, socket, converstation]);

  return (
    <div>
      <ChatGeneral />
    </div>
  );
}

export default Messages;
