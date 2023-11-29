import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { useDispatch } from "react-redux";
// import { useAppDispatch } from "../store/store";

// const dispatch = useAppDispatch();

export interface App {
  users: []; // all users of app who are not friends and not requested yet
  friends: [];
  request_friends: [];
  needUpdate: boolean;
}

const initialState: App = {
  users: [],
  friends: [],
  request_friends: [],
  needUpdate: false,
};

export const AppSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    fetchUsers(state, action) {
      // ~ get all users
      state.users = action.payload;
    },
    resetFriends(state) {
      // console.log(action);
      // ~ get all friends
      state.friends = [];
    },
    fetchRequestFriends(state, action) {
      // ~ get all request friends
      state.request_friends = action.payload;
    },
    updateFriends(state, action) {
      // * update friends
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
    needUpdate(state) {
      state.needUpdate = state.needUpdate ? false : true;
    },
  },
});

export function FetchFriends() {
  console.log('hey from friends')
  // const user_id = localStorage.getItem("user_id");
  return async (dispatch: any) => {
    try {
      const res = await axios.get("http://localhost:3000/auth/friends", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.data) {
        dispatch(AppSlice.actions.updateFriends(res.data));
        console.log("fetch friends succefully!!");
      }
    } catch (err) {
      console.log("unfortuanally you didn't catch a thing");
    }
  };
}

export function BlockFriend(id_user: number)
{
  return async (dispatch: any) => {
    try {
      const res = await axios.post("http://localhost:3000/auth/Block-friends", { id_user }, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.data) {
        dispatch(AppSlice.actions.updateFriends(res.data));
        console.log("block friend succefully!!");
      }
    } catch (err) {
      console.log("unfortuanally you didn't block a thing");
    }
  };
}

export function DeleteFriend(id_user: number)
{
  console.log(id_user)
  return async (dispatch: any) => {
    try {
      const res = await axios.post("http://localhost:3000/auth/remove-friends", { id_user }, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.data) {
        dispatch(AppSlice.actions.updateFriends(res.data));
        console.log("block friend succefully!!");
      }
    } catch (err) {
      console.log("unfortuanally you didn't block a thing");
    }
  }
}

export default AppSlice.reducer;

export const {
  fetchUsers,
  resetFriends,
  fetchRequestFriends,
  updateFriends,
  addFriend,
  acceptFriend,
  removeFriend,
  declineFriend,
  needUpdate,
} = AppSlice.actions;
