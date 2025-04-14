import { configureStore } from "@reduxjs/toolkit";

import { combineReducers } from "redux";
import modalSlice from "./modalSlice";
import fontSizeSlice from "./fontSizeSlice";
import userSlice from "./userSlice";
import librarySlice from "./librarySlice";
import finishedSlice from "./finishedSlice"; // Import finishedSlice



const store = configureStore({
  reducer: {
    modal: modalSlice,
    user: userSlice,
    fontSize: fontSizeSlice,
    library: librarySlice,
    finished: finishedSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
