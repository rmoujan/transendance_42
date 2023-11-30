import { useEffect } from "react";
import { useAppSelector } from "../../redux/store/store";
import { connectSocket, socket } from "../../socket";
import ChatGeneral from "../Chat/ChatGeneral";

function Messages() {
  const { profile, converstation} = useAppSelector(state => state);

  useEffect(() => {
    if (!socket) {
       connectSocket(profile._id.toString());
    }
  }, [profile, socket, converstation]);

  return (
    <div>
      <ChatGeneral />
    </div>
  );
}

export default Messages;
