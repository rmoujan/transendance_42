import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  direct_chat: {
    conversations: [],
    current_conversation: null,
    current_messages: [],
  },
  group_chat: {},
};


export const ConverstationSlice = createSlice({
    name: "converstation",
    initialState,
    reducers: {
        updatedConverstation(state, action) {
            state.direct_chat.conversations = action.payload;
        },
        updatedCurrentConversation(state, action) {
            state.direct_chat.current_conversation = action.payload;
        },
        
})