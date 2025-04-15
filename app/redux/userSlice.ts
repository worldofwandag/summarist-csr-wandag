import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserTypes } from "../types/UserTypes";
import { fetchSubscriptionState } from "../utility/subscriptionService"; // Update the import path

// Define the UserState interface
interface UserState {
  user: UserTypes | null;
  isLoggedIn: boolean;
  isSummaristLoggedIn: boolean;
  isGoogleLoggedIn: boolean;
  isGuestLoggedIn: boolean;
  isSubscribed: boolean;
  isPlusSubscribed: boolean;
}

// Helper function to safely access localStorage
const getLocalStorageItem = (key: string, defaultValue: string) => {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem(key) || defaultValue);
  }
  return JSON.parse(defaultValue);
};

// Initial state
const initialState: UserState = {
  user: null,
  isLoggedIn: false,
  isSummaristLoggedIn: false,
  isGoogleLoggedIn: false,
  isGuestLoggedIn: false,
  isSubscribed: getLocalStorageItem("isSubscribed", "false"), // Safely access localStorage
  isPlusSubscribed: getLocalStorageItem("isPlusSubscribed", "false"), // Safely access localStorage
};

// Create the userSlice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserTypes | null>) {
      state.user = action.payload;
    },
    setSummaristLogin(state, action: PayloadAction<UserTypes>) {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.isSummaristLoggedIn = true;
      state.isGoogleLoggedIn = false;
      state.isGuestLoggedIn = false;
      state.isSubscribed = false;
      state.isPlusSubscribed = false;
      if (typeof window !== "undefined") {
        localStorage.setItem("isSubscribed", "false");
        localStorage.setItem("isPlusSubscribed", "false");
      }
    },
    setGoogleLogin(state, action: PayloadAction<UserTypes>) {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.isSummaristLoggedIn = false;
      state.isGoogleLoggedIn = true;
      state.isGuestLoggedIn = false;
      state.isSubscribed = false;
      state.isPlusSubscribed = false;
      if (typeof window !== "undefined") {
        localStorage.setItem("isSubscribed", "false");
        localStorage.setItem("isPlusSubscribed", "false");
      }
    },
    setGuestLogin(state, action: PayloadAction<UserTypes>) {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.isSummaristLoggedIn = false;
      state.isGoogleLoggedIn = false;
      state.isGuestLoggedIn = true;
      state.isSubscribed = false;
      state.isPlusSubscribed = false;
      if (typeof window !== "undefined") {
        localStorage.setItem("isSubscribed", "false");
        localStorage.setItem("isPlusSubscribed", "false");
      }
    },
    setLoggedOut(state) {
      state.user = null;
      state.isLoggedIn = false;
      state.isSummaristLoggedIn = false;
      state.isGoogleLoggedIn = false;
      state.isGuestLoggedIn = false;
      state.isSubscribed = false;
      state.isPlusSubscribed = false;
      if (typeof window !== "undefined") {
        localStorage.setItem("isSubscribed", "false");
        localStorage.setItem("isPlusSubscribed", "false");
      }
    },
    setSubscribed(state, action: PayloadAction<boolean>) {
      state.isSubscribed = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("isSubscribed", JSON.stringify(action.payload));
      }
    },
    setPlusSubscribed(state, action: PayloadAction<boolean>) {
      state.isPlusSubscribed = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("isPlusSubscribed", JSON.stringify(action.payload));
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSubscriptionState.fulfilled, (state, action) => {
      state.isSubscribed = action.payload.isSubscribed;
      state.isPlusSubscribed = action.payload.isPlusSubscribed;
      if (typeof window !== "undefined") {
        localStorage.setItem("isSubscribed", JSON.stringify(action.payload.isSubscribed));
        localStorage.setItem("isPlusSubscribed", JSON.stringify(action.payload.isPlusSubscribed));
      }
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