import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { useDispatch } from "react-redux";

export interface Profile {
    open: boolean;
    name: string;
    avatar: string;
    default_avatar: string;
    status: string;
    _id: number;
}

const initialState: Profile = {
    open: false,
    name: "",
    avatar: "",
    default_avatar: "",
    status: "",
    _id: 0,
};

export const ProfileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        toggleProfile(state) {
            state.open = !state.open;
        },
        fetchProfile(state, action) {
            state.name = action.payload[0].name;
            state.avatar = action.payload[0].avatar;
            state.default_avatar = action.payload[0].avatar;
            state.status = action.payload[0].status_user;
            state._id = action.payload[0].id_user;
        },
        updateProfile(state, action) {
            state.name = action.payload[0].name;
            state.avatar = action.payload[0].avatar;
            state.default_avatar = action.payload[0].avatar;
            state.status = action.payload[0].status;
            state._id = action.payload[0].id_user;
        },
        updateAvatar(state, action) {
            state.avatar = action.payload;
        },
        editedNameProfile(state, action) {
            state.name = action.payload;
        }
    },
});

export default ProfileSlice.reducer;

export function FetchProfile() {
    // const dispatch = useDispatch();
    return async (dispatch: any) => {
        try {
            const res = await axios.get("http://localhost:3000/auth/get-user", { withCredentials: true })
            if (res.data)
            {
                dispatch(ProfileSlice.actions.fetchProfile(res.data));
            }
            console.log('fetch profile succefully!!');
        } catch (error) {
            console.log("unfortunally there's no friends");
        }
    };
}



export const {
    toggleProfile,
    fetchProfile,
    updateProfile,
    updateAvatar,
    editedNameProfile,
} = ProfileSlice.actions;
