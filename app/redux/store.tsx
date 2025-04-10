import { configureStore } from '@reduxjs/toolkit'
import modalSlice from './modalSlice'
import userSlice from './userSlice'
import fontSizeSlice from './fontSizeSlice'


const store = configureStore({
  reducer: {
    modal: modalSlice,
    user: userSlice,
    fontSize: fontSizeSlice
  },
})

export default store

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;