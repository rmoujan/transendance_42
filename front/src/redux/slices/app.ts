import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { useAppDispatch } from "../store/store";
import { useDispatch } from "react-redux";
// import { useAppDispatch } from "../store/store";

// const dispatch = useAppDispatch();

export interface App {
    users: [], // all users of app who are not friends and not requested yet
    friends: [],
    request_friends: [],
}

const initialState: App = {
    users: [],
    friends: [],
    request_friends: [],
};

export const AppSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        fetchUsers(state, action) {
            // ~ get all users
            state.users = action.payload;
        },
        fetchFriends(state, action) {
            // ~ get all friends
            state.friends = action.payload;
        },
        fetchRequestFriends(state, action) {
            // ~ get all request friends
            state.request_friends = action.payload;
        },
        updateFriends(state, action) {
            // * update friends
            // console.log(action);
            state.friends = action.payload;
        },
        addFriend(state, action) {
            // ? add friend
            state.request_friends = action.payload;
        },
        acceptFriend(state, action) {
            // * accept friend
            state.friends = action.payload;
        },
        removeFriend(state, action) {
            state.friends = action.payload;
        },
        declineFriend(state, action) {
            // * decline friend
            state.request_friends = action.payload;
        },
    },
});

export function FetchFriends() {
    const dispatch = useDispatch();
    // const user_id = localStorage.getItem("user_id");
    return async () => {
        await axios.get("http://localhost:3000/auth/friends", { withCredentials: true,
            headers: {
                "Content-Type": "application/json",
                // Authorization: `Bearer ${getState().auth.token}`,
            },
        }
        )
            .then((response) => {
                // console.log(response.data);
                dispatch(AppSlice.actions.updateFriends(response.data))
            })
            .catch((err) => {
                // console.log(err);
            });
    };
}

export default AppSlice.reducer;
