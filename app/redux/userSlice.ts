import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserTypes } from "../types/UserTypes";

// Define the UserState interface
interface UserState {
  user: UserTypes | null; // The current user object or null if not logged in
  isLoggedIn: boolean; // General logged-in state
  isSummaristLoggedIn: boolean; // State for summaristLogin
  isGoogleLoggedIn: boolean; // State for googleLogin
  isGuestLoggedIn: boolean; // State for guestLogin
}

// Initial state
const initialState: UserState = {
  user: null,
  isLoggedIn: false,
  isSummaristLoggedIn: false,
  isGoogleLoggedIn: false,
  isGuestLoggedIn: false,
};

// Create the userSlice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Action for summaristLogin
    setSummaristLogin: (state, action: PayloadAction<UserTypes>) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.isSummaristLoggedIn = true;
      state.isGoogleLoggedIn = false;
      state.isGuestLoggedIn = false;
    },
    // Action for googleLogin
    setGoogleLogin: (state, action: PayloadAction<UserTypes>) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.isSummaristLoggedIn = false;
      state.isGoogleLoggedIn = true;
      state.isGuestLoggedIn = false;
    },
    // Action for guestLogin
    setGuestLogin: (state, action: PayloadAction<UserTypes>) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.isSummaristLoggedIn = false;
      state.isGoogleLoggedIn = false;
      state.isGuestLoggedIn = true;
    },
    // Action for logging out
    setLoggedOut: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.isSummaristLoggedIn = false;
      state.isGoogleLoggedIn = false;
      state.isGuestLoggedIn = false;
    },
  },
});

// Export actions and reducer
export const { setSummaristLogin, setGoogleLogin, setGuestLogin, setLoggedOut } =
  userSlice.actions;

export default userSlice.reducer;