// This handles FIREBASE authentication and FIREBASE firestore database

import { auth } from "../firebase/config";
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInAnonymously,
  signOut,
} from "firebase/auth";
import { AppDispatch } from "../redux/store"; // For TypeScript
import {
  setSummaristLogin,
  setGoogleLogin,
  setGuestLogin,
  setLoggedOut,
} from "../redux/userSlice";
import { loadSavedBooks, clearSavedBooks } from "../redux/librarySlice";
import { clearFinishedBooks } from "../redux/finishedSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import  store  from "../redux/store"; // Import the Redux store
import { saveStateToLocalStorage } from "../redux/store";

const provider = new GoogleAuthProvider();

// Utility function to serialize the Firebase User object because Redux Toolkit does not support serializing Firebase User objects directly
const serializeUser = (user: User) => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
});

// Save user and login type to localStorage
const saveUserToLocalStorage = (user: any, loginType: string) => {
  localStorage.setItem("user", JSON.stringify(user)); // Save the full user object
  localStorage.setItem("loginType", loginType); // Save the login type
};

// Remove user and login type from localStorage
const removeUserFromLocalStorage = () => {
  localStorage.removeItem("user"); // Remove the user object
  localStorage.removeItem("loginType"); // Remove the login type
};

// Load user from localStorage
const loadUserFromLocalStorage = (): any | null => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null; // Parse and return the user object, or null if not found
};

// Google Login
export const googleLogin = async (dispatch: AppDispatch): Promise<{
  token: string | null;
  user: User;
} | null> => {
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential) {
      const token = credential.accessToken ?? null;
      const user = result.user;
      const serializedUser = serializeUser(user);
      saveUserToLocalStorage(serializedUser, "google"); // Save user to localStorage
      dispatch(setGoogleLogin(serializedUser)); // Dispatch user to Redux
      dispatch(loadSavedBooks({ userId: serializedUser.uid })); // Load saved books for the user
      return { token, user };
    } else {
      console.error("No credential found in the result.");
      return null;
    }
  } catch (error: any) {
    console.error("Error during Google login:", error);
    throw error;
  }
};

// Summarist Account Registration
export const summaristRegister = async (
  email: string,
  password: string,
  dispatch: AppDispatch
): Promise<User | null> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const serializedUser = serializeUser(user);
    saveUserToLocalStorage(serializedUser, "summarist"); // Save user to localStorage
    dispatch(setSummaristLogin(serializedUser)); // Dispatch user to Redux
    dispatch(loadSavedBooks({ userId: serializedUser.uid })); // Load saved books for the user
    return user;
  } catch (error: any) {
    console.error("Error during registration:", error);
    throw error;
  }
};

// Summarist Login
export const summaristLogin = async (
  email: string,
  password: string,
  dispatch: AppDispatch
): Promise<User | null> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const serializedUser = serializeUser(user);
    saveUserToLocalStorage(serializedUser, "summarist"); // Save user to localStorage
    dispatch(setSummaristLogin(serializedUser)); // Dispatch user to Redux
    dispatch(loadSavedBooks({ userId: serializedUser.uid })); // Load saved books for the user
    return user;
  } catch (error: any) {
    console.error("Error during login:", error);
    throw error;
  }
};

// Guest Login
export const guestLogin = async (dispatch: AppDispatch): Promise<User | null> => {
  try {
    const userCredential = await signInAnonymously(auth);
    const user = userCredential.user;
    const serializedUser = serializeUser(user);
    saveUserToLocalStorage(serializedUser, "guest"); // Save user to localStorage
    dispatch(setGuestLogin(serializedUser)); // Dispatch user to Redux
    return user;
  } catch (error: any) {
    console.error("Error during guest login:", error);
    throw error;
  }
};

// Logout User
export const logoutUser = async (dispatch: AppDispatch): Promise<void> => {
  try {
    // Save the current state to localStorage before clearing it
    saveStateToLocalStorage(store.getState());

    // Sign out the user from Firebase
    await signOut(auth);

    // Remove user-related data from localStorage
    removeUserFromLocalStorage();

    // Clear Redux state
    dispatch(clearSavedBooks()); // Clear saved books from Redux
    dispatch(clearFinishedBooks()); // Clear finished books from Redux
    dispatch(setLoggedOut()); // Clear user data from Redux

    console.log("User signed out successfully.");
  } catch (error: any) {
    console.error("Error during logout:", error);
    throw error;
  }
};

// Password Reset
export const forgotPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent successfully.");
  } catch (error: any) {
    console.error("Error during password reset:", error);
    throw error;
  }
};

// Fetch subscription state from the database
export const fetchSubscriptionState = createAsyncThunk(
  "user/fetchSubscriptionState",
  async (email: string) => {
    try {
      const response = await fetch(`/api/getSubscriptionState?email=${email}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch subscription state: ${response.statusText}`);
      }
      const data = await response.json();
      return data; // { isSubscribed: boolean, isPlusSubscribed: boolean }
    } catch (error) {
      console.error("Error fetching subscription state:", error);
      throw error;
    }
  }
);