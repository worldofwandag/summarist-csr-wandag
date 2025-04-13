import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserTypes } from "../types/UserTypes";
import { fetchSubscriptionState } from "../utility/auth";

// Define the UserState interface
interface UserState {
  user: UserTypes | null; // The current user object or null if not logged in
  isLoggedIn: boolean; // General logged-in state
  isSummaristLoggedIn: boolean; // State for summaristLogin
  isGoogleLoggedIn: boolean; // State for googleLogin
  isGuestLoggedIn: boolean; // State for guestLogin
  isSubscribed: boolean; // State for premium subscription
  isPlusSubscribed: boolean; // State for premium plus subscription
}

// Initial state
const initialState: UserState = {
  user: null,
  isLoggedIn: false,
  isSummaristLoggedIn: false,
  isGoogleLoggedIn: false,
  isGuestLoggedIn: false,
  isSubscribed: false, // Default value for subscription
  isPlusSubscribed: false, // Default value for plus subscription
};

// Create the userSlice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Action to set the user object
    setUser(state, action: PayloadAction<UserTypes | null>) {
      state.user = action.payload;
    },
    // Action for summaristLogin
    setSummaristLogin(state, action: PayloadAction<UserTypes>) {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.isSummaristLoggedIn = true;
      state.isGoogleLoggedIn = false;
      state.isGuestLoggedIn = false;
      state.isSubscribed = false; // Reset subscription state
      state.isPlusSubscribed = false; // Reset plus subscription state
    },
    // Action for googleLogin
    setGoogleLogin(state, action: PayloadAction<UserTypes>) {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.isSummaristLoggedIn = false;
      state.isGoogleLoggedIn = true;
      state.isGuestLoggedIn = false;
      state.isSubscribed = false; // Reset subscription state
      state.isPlusSubscribed = false; // Reset plus subscription state
    },
    // Action for guestLogin
    setGuestLogin(state, action: PayloadAction<UserTypes>) {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.isSummaristLoggedIn = false;
      state.isGoogleLoggedIn = false;
      state.isGuestLoggedIn = true;
      state.isSubscribed = false; // Reset subscription state
      state.isPlusSubscribed = false; // Reset plus subscription state
    },
    // Action for logging out
    setLoggedOut(state) {
      state.user = null;
      state.isLoggedIn = false;
      state.isSummaristLoggedIn = false;
      state.isGoogleLoggedIn = false;
      state.isGuestLoggedIn = false;
      state.isSubscribed = false; // Reset subscription state
      state.isPlusSubscribed = false; // Reset plus subscription state
    },
    // Action to set subscription status
    setSubscribed(state, action: PayloadAction<boolean>) {
      state.isSubscribed = action.payload;
    },
    // Action to set plus subscription status
    setPlusSubscribed(state, action: PayloadAction<boolean>) {
      state.isPlusSubscribed = action.payload;
    },
   
  },
  extraReducers: (builder) => {
    // Handle the fetchSubscriptionState async action
    builder.addCase(fetchSubscriptionState.fulfilled, (state, action) => {
      state.isSubscribed = action.payload.isSubscribed;
      state.isPlusSubscribed = action.payload.isPlusSubscribed;
    });
  },
});

// Export actions
export const {
  setUser,
  setSummaristLogin,
  setGoogleLogin,
  setGuestLogin,
  setLoggedOut,
  setSubscribed,
  setPlusSubscribed,
  
} = userSlice.actions;

export default userSlice.reducer;