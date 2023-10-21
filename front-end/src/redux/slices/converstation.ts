import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  direct_chat: {
    conversations: [],
    current_conversation: null,
    current_messages: [],
  },
  channel_chat: {
    conversations: [],
    current_conversation: null,
    current_messages: [],
    type_channel: null,
  },
};


export const ConverstationSlice = createSlice({
    name: "converstation",
    initialState,
    reducers: {
        fetchConverstation(state, action) {
          // ! get all converstation
          state.direct_chat.conversations = action.payload
        },
        updatedConverstation(state, action) {
          // * update converstation
            state.direct_chat.conversations = action.payload;
        },
        addConversation(state, action) {
          // ? adding new converstattion
            state.direct_chat.current_conversation = action.payload;
        },
        setCurrentConverstation(state, action) {
          // * set current converstation
          state.direct_chat.current_conversation = action.payload;
        },
        fetchCurrentMessages(state, action) {
          // ! get all messages of current converstation
          state.direct_chat.current_messages = action.payload;
        }
        
      }
        
})


/*
  fetchDirectConversations(state, action) {
      const list = action.payload.conversations.map((el) => {
        const user = el.participants.find(
          (elm) => elm._id.toString() !== user_id
        );
        return {
          id: el._id,
          user_id: user?._id,
          name: `${user?.firstName} ${user?.lastName}`,
          online: user?.status === "Online",
          img: `https://${S3_BUCKET_NAME}.s3.${AWS_S3_REGION}.amazonaws.com/${user?.avatar}`,
          msg: el.messages.slice(-1)[0].text, 
          time: "9:36",
          unread: 0,
          pinned: false,
          about: user?.about,
        };
      });

      state.direct_chat.conversations = list;
    },
    updateDirectConversation(state, action) {
      const this_conversation = action.payload.conversation;
      state.direct_chat.conversations = state.direct_chat.conversations.map(
        (el) => {
          if (el?.id !== this_conversation._id) {
            return el;
          } else {
            const user = this_conversation.participants.find(
              (elm) => elm._id.toString() !== user_id
            );
            return {
              id: this_conversation._id._id,
              user_id: user?._id,
              name: `${user?.firstName} ${user?.lastName}`,
              online: user?.status === "Online",
              img: faker.image.avatar(),
              msg: faker.music.songName(),
              time: "9:36",
              unread: 0,
              pinned: false,
            };
          }
        }
      );
    },
    addDirectConversation(state, action) {
      const this_conversation = action.payload.conversation;
      const user = this_conversation.participants.find(
        (elm) => elm._id.toString() !== user_id
      );
      state.direct_chat.conversations = state.direct_chat.conversations.filter(
        (el) => el?.id !== this_conversation._id
      );
      state.direct_chat.conversations.push({
        id: this_conversation._id._id,
        user_id: user?._id,
        name: `${user?.firstName} ${user?.lastName}`,
        online: user?.status === "Online",
        img: faker.image.avatar(),
        msg: faker.music.songName(),
        time: "9:36",
        unread: 0,
        pinned: false,
      });
    },
    setCurrentConversation(state, action) {
      state.direct_chat.current_conversation = action.payload;
    },
    fetchCurrentMessages(state, action) {
      const messages = action.payload.messages;
      const formatted_messages = messages.map((el) => ({
        id: el._id,
        type: "msg",
        subtype: el.type,
        message: el.text,
        incoming: el.to === user_id,
        outgoing: el.from === user_id,
      }));
      state.direct_chat.current_messages = formatted_messages;
    },
    addDirectMessage(state, action) {
      state.direct_chat.current_messages.push(action.payload.message);
    }
*/