import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { ContactSlice } from "../slices/contact";
import { ConverstationSlice } from "../slices/converstation";
import { AppSlice } from "../slices/app";
import { ProfileSlice } from "../slices/profile";
import { CharacterSlice } from "../slices/anime";
import { ChannelsSlice } from "../slices/channels";

export const store = configureStore({
  reducer: {
    contact: ContactSlice.reducer,
    converstation: ConverstationSlice.reducer,
    app: AppSlice.reducer,
    profile: ProfileSlice.reducer,
    characters: CharacterSlice.reducer,
    channels: ChannelsSlice.reducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;