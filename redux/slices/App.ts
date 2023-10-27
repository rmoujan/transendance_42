import { createSlice } from "@reduxjs/toolkit";
//
import { dispatch } from "../store";

// ----------------------------------------------------------------------

const initialState = {
    sideBar: {
        open: false,
        type: "CONTACT", // can be CONTACT, STARRED, SHARED
    },
};

const slice = createSlice({
    name: "app",
    initialState,
    reducers: {
        // Toggle Sidebar
        toggleDialog(state) {
            state.sideBar.open = !state.sideBar.open;
        },
        updatedContactInfo(state, action) {
            state.sideBar.type = action.payload.type;
        },
    },
});

// Reducer
export default slice.reducer;

// thunk fuunctions

export function toggleDialog() {
    return async () => {
        dispatch(slice.actions.toggleDialog());
    };
}
export function updatedContactInfo(type) {
    return async () => {
        dispatch(slice.actions.updatedContactInfo({ type }));
    };
}
