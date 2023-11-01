import { useEffect } from "react";
import ChatGeneral from "../Chat/ChatGeneral";
import { connectSocket, socket } from "../../socket";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";
import { FetchFriends } from "../../redux/slices/app";
import { fetchCurrentMessages, setCurrentConverstation } from "../../redux/slices/converstation";

function Messages() {
  const { profile, converstation } = useAppSelector(state => state);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!socket) {
      // console.log("socket not found");
      connectSocket(profile._id.toString());
      console.log("socket connected");

      socket.on("chatToDm", (data: any) => {
        console.log("received data !!", data);
      });

      socket.on("chatToDm", (data:any) => {
        console.log(data)
        console.log(converstation.direct_chat.current_conversation, data);
        // check if msg we got is from currently selected conversation
        // if (converstation.direct_chat.current_conversation.id === data.id) {
          dispatch(
            fetchCurrentMessages({
              id: data.id,
              type: "msg",
              subtype: data.subtype,
              message: data.message,
              incoming: data.send === profile._id,
              outgoing: data.receive === profile._id,
            })
          );
        // }
      });

      
    }
    // return () => {
    //   if (socket) {
    //     socket.off();
    //     console.log("socket off");
    //   }
    // }
  }, [profile, socket, converstation]);

  return (
    <div>
      <ChatGeneral />
    </div>
  );
}

export default Messages;
