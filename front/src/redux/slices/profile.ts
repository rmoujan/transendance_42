import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { useDispatch } from "react-redux";

export interface Profile {
    name: string;
    avatar: string;
    status: string;
    _id: string;
}

const initialState: Profile = {
    name: "",
    avatar: "",
    status: "",
    _id: "",
};

export const ProfileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        fetchProfile(state, action) {
            state.name = action.payload[0].name;
            state.avatar = action.payload[0].avatar;
            state.status = action.payload[0].status_user;
            state._id = action.payload[0].id_user;
        },
        updateProfile(state, action) {
            state.name = action.payload[0].name;
            state.avatar = action.payload[0].avatar;
            state.status = action.payload[0].status;
            state._id = action.payload[0].id_user;
        },
    },
});

export default ProfileSlice.reducer;

export function FetchProfile() {
    const dispatch = useDispatch();
    return async () => {
        await axios
            .get("http://localhost:3000/auth/get-user", { withCredentials: true })
            .then((res) => {
                dispatch(ProfileSlice.actions.fetchProfile(res.data));
            })
            .catch((err) => {
                console.log(err);
            })
    };
}