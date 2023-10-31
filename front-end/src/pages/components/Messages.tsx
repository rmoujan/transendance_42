import { useEffect } from "react";
import ChatGeneral from "../Chat/ChatGeneral";
import { connectSocket, socket } from "../../socket";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";
import { FetchFriends } from "../../redux/slices/app";
import { setCurrentConverstation } from "../../redux/slices/converstation";

function Messages() {
  const { profile, converstation } = useAppSelector(state => state);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!socket) {
      // console.log("socket not found");
      connectSocket(profile._id);
      console.log("socket connected");

      socket.on("chatToDm", (data: any) => {
        console.log("received data !!", data);
      });

      // socket.on("chatToDm", (data:any) => {
      //   const message = data.message;
      //   console.log(converstation.direct_chat.current_conversation, data);
      //   // check if msg we got is from currently selected conversation
      //   if (converstation.direct_chat.current_conversation?.id === data.conversation_id) {
      //     dispatch(
      //       setCurrentConverstation({
      //         id: message._id,
      //         type: "msg",
      //         subtype: message.type,
      //         message: message.text,
      //         incoming: message.to === profile._id,
      //         outgoing: message.from === profile._id,
      //       })
      //     );
      //   }
      // });

      
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
