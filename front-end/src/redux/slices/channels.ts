import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Channel {
  members: [];
  channel_id: string;
  current_messages: [];
  channel_type: string;
}

export interface ChannelState {
  channels: Channel[];
  current_channel: Channel | null;
  current_messages: [];
}

const initialState: ChannelState = {
  channels: [],
  current_channel: null,
  current_messages: [],
};

export const ChannelSlice = createSlice({
    name: 'channel',
    initialState,
    
    reducers: {
        fetchChannels(state, action: PayloadAction<Channel[]>) {
        state.channels = action.payload;
        },
        updatedChannels(state, action: PayloadAction<Channel[]>) {
        state.channels = action.payload;
        },
        addChannel(state, action: PayloadAction<Channel>) {
        state.channels.push(action.payload);
        },
        setCurrentChannel(state, action: PayloadAction<Channel>) {
        state.current_channel = action.payload;
        },
        fetchCurrentMessages(state, action: PayloadAction<[]>) {
        state.current_messages = action.payload;
        },
        addMessage(state, action: PayloadAction<[]>) {
        state.current_messages.push(action.type);
        },
    },
    });
    