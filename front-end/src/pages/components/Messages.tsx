import React, {useEffect} from "react";
import ChatGeneral from "../Chat/ChatGeneral";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";
import {socket, connectSocket} from "../../socket"

function Messages() {
  const dispatch = useAppDispatch();
  const { _id , status} = useAppSelector((state) => state.profile);

  useEffect(() => {
    if (status) {

      if (!socket) {
        connectSocket(_id);
      }

      socket.on("new_message", (data) => {
        const message = data.message;
        console.log(message, data);
        // check if msg we got is from currently selected conversation
        // if (current_conversation?.id === data.conversation_id) {
        //   dispatch(
        //     AddDirectMessage({
        //       id: message._id,
        //       type: "msg",
        //       subtype: message.type,
        //       message: message.text,
        //       incoming: message.to === user_id,
        //       outgoing: message.from === user_id,
        //     })
        //   );
        // }
      });

      socket.on("start_chat", (data) => {
        console.log(data);
        // add / update to conversation list
        const existing_conversation = conversations.find(
          (el) => el?.id === data._id
        );
        if (existing_conversation) {
          // update direct conversation
          dispatch(updatedConverstation({ conversation: data }));
        } else {
          // add direct conversation
          dispatch(addConversation({ conversation: data }));
        }
        // select converstation
        // dispatch(SelectConversation({ room_id: data._id }));
      });

    }

    // Remove event listener on component unmount
    return () => {
      socket?.off("start_chat");
      socket?.off("new_message");
    };
  }, [status, socket]);

  return (
    <div>
      <ChatGeneral />
    </div>
  );
}

export default Messages;
