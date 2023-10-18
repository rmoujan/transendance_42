import { createSlice } from "@reduxjs/toolkit";

import { dispatch } from "../store";

interface ContactInfo {
    open: boolean;
    type: string;
}

interface ContactInfoState {
    contactInfo: ContactInfo;
}

const initialState: ContactInfoState = {
    contactInfo: {
        open: false,
        type: "CONTACT", // it can be CONTACT or STARRED or SHARED
    },
};

const appSlice = createSlice({
    name: "contact",
    initialState,
    reducers: {
        openContactInfo: (state, action) => {
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
