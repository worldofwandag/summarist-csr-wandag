import { configureStore } from "@reduxjs/toolkit";
import modalSlice from "./modalSlice";
import fontSizeSlice from "./fontSizeSlice";
import userSlice from "./userSlice";
import librarySlice from "./librarySlice";
import finishedSlice from "./finishedSlice";

// Save state to localStorage for a specific user
export const saveStateToLocalStorage = (state: any) => {
  try {
    const user = state.user; // Get the user object from Redux state
    if (user && user.uid) {
      const serializedState = JSON.stringify({
        library: state.library.savedBooks,
        finished: state.finished.finishedBooks,
      });
      localStorage.setItem(`reduxState_${user.uid}`, serializedState); // Use the user's UID
    }
  } catch (error) {
    console.error("Error saving state to localStorage:", error);
  }
};

// Load state from localStorage for a specific user
const loadStateFromLocalStorage = () => {
  if (typeof window === "undefined") {
    // Return undefined during SSR to avoid hydration mismatch
    return undefined;
  }

  try {
    const user = JSON.parse(localStorage.getItem("user") || "null"); // Retrieve the user object
    if (!user || !user.uid) {
      console.warn("No valid user found in localStorage.");
      return undefined; // No user logged in, return undefined
    }

    const serializedState = localStorage.getItem(`reduxState_${user.uid}`); // Use the user's UID
    if (serializedState) {
      const parsedState = JSON.parse(serializedState);
      return {
        library: { savedBooks: parsedState.library || {} },
        finished: { finishedBooks: parsedState.finished || {} },
      };
    }

    // Fallback: Load savedBooks and finishedBooks directly from localStorage
    const savedBooks = JSON.parse(localStorage.getItem("savedBooks") || "{}");
    const finishedBooks = JSON.parse(localStorage.getItem("finishedBooks") || "{}");

    return {
      library: { savedBooks },
      finished: { finishedBooks },
    };
  } catch (error) {
    console.error("Error loading state from localStorage:", error);
    return undefined;
  }
};

// Load initial state from localStorage
const preloadedState = loadStateFromLocalStorage();

const store = configureStore({
  reducer: {
    modal: modalSlice,
    user: userSlice,
    fontSize: fontSizeSlice,
    library: librarySlice,
    finished: finishedSlice,
  },
  preloadedState, // Use the loaded state as the initial state
});

// Subscribe and saved finished books to store changes and save to localStorage
if (typeof window !== "undefined") {
  store.subscribe(() => {
    const state = store.getState();
    saveStateToLocalStorage(state); // Use the saveStateToLocalStorage function
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;