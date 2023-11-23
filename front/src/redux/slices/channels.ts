import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Channel {
  members: [];
  channel_id: string;
  image: string;
  name: string;
  owner: [];
  admin: [];
  last_messages: string;
  time: string;
  unread: number;
  current_messages: [];
  channel_type: string;
}

interface ConversationChannel {
  room_id: string;
  user_id: string;
  title: string;
  img: string;
  last_msg: string;
  time: string;
  unread: number;
}
export interface ChannelState {

  channels: Channel[];
  publicChannels: [];
  protectedChannels: [];
  privateChannels: [];
  channels_conversation: ConversationChannel[];
  current_channel: Channel | null;
  current_messages: any[];
}

const initialState: ChannelState = {
  channels: [],
  publicChannels: [],
  protectedChannels: [],
  privateChannels: [],
  channels_conversation: [],
  current_channel: null,
  current_messages: [],
};

export const ChannelsSlice = createSlice({
  name: 'channels',
  initialState,

  reducers: {
    fetchPublicChannels(state, action) {
      //~ get all public channels
      // console.log(action.payload);
      state.publicChannels = action.payload;
    },
    fetchProtectedChannels(state, action) {
      //~ get all protected channels
      // console.log(action.payload);
      state.protectedChannels = action.payload;
    },
    fetchPrivateChannels(state, action) {
      //~ get all private channels
      // console.log(action.payload);
      state.privateChannels = action.payload;
    },
    fetchChannels(state, action) {
      //! get all channels conversation
      const formatDateTime = (dateString: string): string => {
        const inputDate = new Date(dateString);
        const currentDate = new Date();

        const isToday = inputDate.toDateString() === currentDate.toDateString();

        if (isToday) {
          const hours = inputDate.getHours();
          const minutes = inputDate.getMinutes();
          return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        } else {
          const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
          return inputDate.toLocaleDateString(undefined, options);
        }
      };
      // console.log(action.payload);
      // state.channels = action.payload;
      state.channels = action.payload.map((el: any) => ({
        channel_id: el.channel_id,
        image: el.image,
        name: el.name,
        owner: el.owner,
        admin: el.admin,
        members: el.members,
        last_messages: el.last_messages,
        time: formatDateTime(el.time),
        unread: el.unread,
        channel_type: el.channel_type,
      }));
    },
    updatedChannels(state, action: PayloadAction<Channel[]>) {
      //! update channels
      state.channels = action.payload;
    },
    addNewChannel(state, action: PayloadAction<Channel>) {
      //! add new channel
      state.channels.push(action.payload);
    },
    setCurrentChannel(state, action) {

      //! set current channel

      const messages: any = action.payload.messages;
      const idChannel = messages[0]?.channelId;
      console.log(action.payload)
      state.current_channel = state.channels.filter((el: any) => el?.channel_id === idChannel)[0];
      const user_id = action.payload.user_id;
      const formatted_messages = messages.map((el: any) => ({
        id: el.id,
        type: "msg",
        message: el.message,
        incoming: el.userId !== user_id,
        outgoing: el.userId === user_id,
      }));
      state.current_messages = formatted_messages;
    },
    setEmptyChannel(state) {
      state.current_channel = null;
      state.current_messages = [];
    },
    fetchCurrentMessages(state, action: PayloadAction<[]>) {
      //! get all messages of current channel
      state.current_messages = action.payload;
    },
    updateChannelsMessages(state, action) {
      const message: any = action.payload.messages; // Assuming 'messages' is a single message object
      const user_id: any = action.payload.user_id;
      console.log(action.payload);
      const formatted_message: any = {
        id: message.id,
        type: message.type,
        message: message.message,
        incoming: message.sender_id !== user_id,
        outgoing: message.sender_id === user_id,
      };
      // console.log(formatted_message);

      state.current_messages.push(formatted_message);
    },
  },
});




export function FetchChannels() {
  return async (dispatch: any) => {
    await axios
      .get("http://localhost:3000/channels/allChannels", {
        withCredentials: true, headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res.data);
        dispatch(ChannelsSlice.actions.fetchChannels(res.data));
      })
      .catch((err) => console.log(err));
  };
}

export function FetchPublicChannels() {
  return async (dispatch: any) => {
    await axios
      .get("http://localhost:3000/channels/allPublic", {
        withCredentials: true, headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res.data);
        dispatch(ChannelsSlice.actions.fetchPublicChannels(res.data));
      })
      .catch((err) => console.log(err));
  };
}

export function FetchProtectedChannels() {
  return async (dispatch: any) => {
    await axios
      .get("http://localhost:3000/channels/allProtected", {
        withCredentials: true, headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res.data);
        dispatch(ChannelsSlice.actions.fetchProtectedChannels(res.data));
      })
      .catch((err) => console.log(err));
  };
}

export const {
  fetchProtectedChannels,
  fetchPublicChannels,
  fetchChannels,
  updatedChannels,
  addNewChannel,
  setCurrentChannel,
  setEmptyChannel,
  fetchCurrentMessages,
  updateChannelsMessages,
} = ChannelsSlice.actions;

export default ChannelsSlice.reducer;
