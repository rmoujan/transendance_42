import { createSlice } from "@reduxjs/toolkit";

export interface Contact {
  contactInfos: {
    open: boolean;
    type: string;
  };
  type_chat: string;
  room_id: string;
}

const initialState: Contact = {
  contactInfos: {
    open: false,
    type: "CONTACT",
  },
  type_chat: "",
  room_id: "",
};

export const ContactSlice = createSlice({
  name: "contact",
  initialState,
  
  reducers: {
    toggleDialog(state) {
      state.contactInfos.open = !state.contactInfos.open;
    },
    updatedContactInfo(state, action) {
      state.contactInfos.type = action.payload;
    },
    selectConversation(state, action) {
      console.log(action.payload);
      state.type_chat = "individual";
      state.room_id = action.payload.room_id;
    },
  },
});

export const { toggleDialog, updatedContactInfo, selectConversation } =
  ContactSlice.actions;
export default ContactSlice.reducer;
