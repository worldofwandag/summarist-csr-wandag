import { configureStore } from "@reduxjs/toolkit";
import modalSlice from "./modalSlice";
import fontSizeSlice from "./fontSizeSlice";
import userSlice from "./userSlice";



// Create the Redux store
const store = configureStore({
  reducer: {
    modal: modalSlice,
    user: userSlice,
    fontSize: fontSizeSlice,
  },
});



export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;