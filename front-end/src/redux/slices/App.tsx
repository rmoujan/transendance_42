import { createSlice } from "@reduxjs/toolkit";

import { dispatch } from "../store";

interface ContactInfo {
  open: boolean;
  type: "CONTACT" | "STARRED" | "SHARED";
}

interface ContactInfoState {
  contactInfo: ContactInfo;
  chat_type: string | null;
  room_id: string | null;
}

const initialState: ContactInfoState = {
  contactInfo: {
    open: false,
    type: "CONTACT", // it can be CONTACT or STARRED or SHARED
  },
  chat_type: null,
  room_id: null,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    openContactInfo: (state) => {
      state.contactInfo.open = !state.contactInfo.open;
    },
    updatedContactInfo(state, action) {
      state.contactInfo.type = action.payload.type;
    },
  },
});

export default appSlice.reducer;

export function toggleDialog() {
  return async () => {
    dispatch(appSlice.actions.openContactInfo());
  };
}

export const updatedContactInfo = (type: string) => {
  dispatch(
    appSlice.actions.updatedContactInfo({
      type,
    })
  );
};
