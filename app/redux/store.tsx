import { configureStore } from '@reduxjs/toolkit'
import modalSlice from './modalSlice'
import userSlice from './userSlice'


const store = configureStore({
  reducer: {
    modal: modalSlice,
    user: userSlice
  },
})

export default store

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;