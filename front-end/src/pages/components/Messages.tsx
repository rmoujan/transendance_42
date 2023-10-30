import { useEffect } from "react";
import ChatGeneral from "../Chat/ChatGeneral";
import { connectSocket, socket } from "../../socket";
import { useAppSelector } from "../../redux/store/store";

function Messages() {
  const { profile } = useAppSelector(state => state);

  useEffect(() => {
    if (!socket) {
      console.log("socket not found");
      connectSocket(profile._id);
      console.log("socket connected");

      
    }
    // return () => {
    //   if (socket) {
    //     socket.off();
    //     console.log("socket off");
    //   }
    // }
  }, [profile._id, socket]);

  return (
    <div>
      <ChatGeneral />
    </div>
  );
}

export default Messages;
