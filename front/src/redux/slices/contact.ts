import { createSlice } from "@reduxjs/toolkit";

export interface Contact {
  contactInfos: {
    open: boolean;
    type: string;
  };
  name: string;
  avatar: string;
  type_chat: string;
  room_id: number;
  chat_id: number;
  muted: boolean;
  blocked: boolean;
  snackbar: {
    open: boolean;
    severity: string;
    message: string;
  };
}

const initialState: Contact = {
  contactInfos: {
    open: false,
    type: "CONTACT",
  },
  name: "",
  avatar: "",
  type_chat: "",
  room_id: 0,
  chat_id: 0,
  muted: false,
  blocked: false,
  snackbar: {
    open: false,
    severity: "",
    message: "",
  },
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
      console.log(action.payload)
      state.type_chat = action.payload.type_chat;
      state.room_id = action.payload.room_id;
      state.name = action.payload.name;
      state.avatar = action.payload.avatar;
    },
    selectChat(state, action) {
      console.log(action.payload);
      state.chat_id = action.payload.room_id;
    },
    mutedContact(state, action) {
      state.room_id = action.payload.room_id;
      state.muted = !state.muted;
    },
    blockedContact(state, action) {
      state.room_id = action.payload.room_id;
      state.blocked = !state.blocked;
    },
    openSnackBar(state, action) {
      // console.log(action.payload);
      state.snackbar.open = true;
      state.snackbar.severity = action.payload.severity;
      state.snackbar.message = action.payload.message;
    },
    closeSnackBar(state) {
      // console.log("This is getting executed");
      state.snackbar.open = false;
      state.snackbar.message = "";
    },
    resetContact(state) {
      state.contactInfos.open = false;
      state.contactInfos.type = "CONTACT";
      state.name = "";
      state.avatar = "";
      state.type_chat = "";
      state.room_id = 0;
      state.chat_id = 0;
      state.muted = false;
      state.blocked = false;
      state.snackbar.open = false;
      state.snackbar.severity = "";
      state.snackbar.message = "";
    }
  },
});

export const showSnackbar =
  ({ severity, message }: any) =>
    async (dispatch: any) => {
      console.log(message, severity)
      dispatch(
        ContactSlice.actions.openSnackBar({
          message,
          severity,
        })
      );

      setTimeout(() => {
        dispatch(ContactSlice.actions.closeSnackBar());
      }, 4000);
    };
export const {
  toggleDialog,
  updatedContactInfo,
  selectConversation,
  mutedContact,
  closeSnackBar,
  selectChat,
  resetContact
} = ContactSlice.actions;
export default ContactSlice.reducer;
