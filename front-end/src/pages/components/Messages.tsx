import { useEffect } from "react";
import ChatGeneral from "../Chat/ChatGeneral";
import { connectSocket, socket } from "../../socket";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";
import { FetchFriends } from "../../redux/slices/app";
import { fetchCurrentMessages, setCurrentConverstation } from "../../redux/slices/converstation";

function Messages() {
  const { profile, converstation, contact } = useAppSelector(state => state);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!socket) {
      // console.log("socket not found");
      connectSocket(profile._id.toString());
      console.log("socket connected");



      socket.on("chatToDm", (data:any) => {
        //~ check if msg we got is from currently selected conversation
        // if (converstation.direct_chat.current_conversation.id === data.id) {
          dispatch(
            fetchCurrentMessages({
              id: data.id,
              type: "msg",
              subtype: data.subtype,
              message: data.message,
              outgoing: data.send === profile._id, //incoming
              incoming: data.recieve === profile._id, //outgoing
            })
          );
        // }
      });

      // ! check if exist converstation
      // socket.on("start_chat", (data) => {
      //   console.log(data);
      //   // add / update to conversation list
      //   const existing_conversation = conversations.find(
      //     (el) => el?.id === data._id
      //   );
      //   if (existing_conversation) {
      //     // update direct conversation
      //     dispatch(UpdateDirectConversation({ conversation: data }));
      //   } else {
      //     // add direct conversation
      //     dispatch(AddDirectConversation({ conversation: data }));
      //   }
      //   dispatch(SelectConversation({ room_id: data._id }));
      // });

      
    }
    return () => {
      if (socket) {
        socket?.off("chatToDm");
        console.log("socket off");
      }
    }
  }, [profile, socket, converstation]);

  return (
    <div>
      <ChatGeneral />
    </div>
  );
}

export default Messages;
