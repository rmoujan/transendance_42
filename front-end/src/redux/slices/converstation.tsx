import { createSlice } from "@reduxjs/toolkit";

import { dispatch } from "../store";
// Define types for the user, conversation, and message
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  status: string;
  about: string;
}

interface Conversation {
  _id: string;
  participants: User[];
  messages: {
    _id: string;
    text: string;
    to: string;
    from: string;
    type: string;
  }[];
}

interface DirectConversation {
  id: string;
  user_id: string;
  name: string;
  online: boolean;
  img: string;
  msg: string;
  time: string;
  unread: number;
  pinned: boolean;
  about: string;
}

interface DirectMessage {
  id: string;
  type: string;
  subtype: string;
  message: string;
  incoming: boolean;
  outgoing: boolean;
}

// Define the state structure for direct chat and group chat
interface DirectChatState {
  conversations: DirectConversation[];
  current_conversation: DirectConversation | null;
  current_messages: DirectMessage[];
}

interface GroupChatState {
  [key: string]: any; // Define the structure based on your needs
}

interface ConversationState {
  direct_chat: DirectChatState;
  group_chat: GroupChatState;
}

// ! Retrieve the user ID from local storage
const user_id = window.localStorage.getItem("user_id");

// Define the initial state
const initialState: ConversationState = {
  direct_chat: {
    conversations: [],
    current_conversation: null,
    current_messages: [],
  },
  group_chat: {},
};


const converstationSlice = createSlice({
    name: "converstation",
    initialState,
    reducers: {
        updateDirectChat(state, action) {
            state.direct_chat.conversations = action.payload.conversations;
            state.direct_chat.current_conversation = action.payload.current_conversation;
            state.direct_chat.current_messages = action.payload.current_messages;
        },
        updateGroupChat(state, action) {
            state.group_chat = action.payload;
        },
    },

});