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
import { AppDispatch } from "../redux/store"; //   for typescript
import { setSummaristLogin, setGoogleLogin, setGuestLogin, setLoggedOut } from "../redux/userSlice";

const provider = new GoogleAuthProvider();
// auth.languageCode = "en";

// Utility function to serialize the Firebase User object because Redux Toolkit does not support serializing Firebase User objects directly
const serializeUser = (user: User) => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
});

// Save user and login type to localStorage
const saveUserToLocalStorage = (user: any, loginType: string) => {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("loginType", loginType);
};

// Remove user and login type from localStorage
const removeUserFromLocalStorage = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("loginType");
};

// googleLogin
export const googleLogin = async (dispatch: AppDispatch): Promise<{
  token: string | null;
  user: User;
} | null> => {
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential) {
      const token = credential.accessToken ?? null; // Convert undefined to null
      const user = result.user;
      const serializedUser = serializeUser(user); // Serialize the user object
      // Save user to localStorage
      saveUserToLocalStorage(serializedUser, "google");
      console.log("Token:", token);
      console.log("User:", serializedUser);
      dispatch(setGoogleLogin(serializedUser)); // Dispatch the user to the Redux store
      return { token, user }; // Return token and user for further use
    } else {
      console.error("No credential found in the result.");
      return null;
    }
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData?.email;
    const credential = GoogleAuthProvider.credentialFromError(error);
    console.error("Error Code:", errorCode);
    console.error("Error Message:", errorMessage);
    console.error("Email:", email);
    console.error("Credential Error:", credential);
    throw error; // Re-throw the error for handling in the calling function
  }
};

// creating a Summarist Account

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
    const serializedUser = serializeUser(user); // Serialize the user object
    // Save user to localStorage
    saveUserToLocalStorage(serializedUser, "summarist");
    console.log("User registered successfully:", serializedUser);
    dispatch(setSummaristLogin(serializedUser)); // Dispatch the user to the Redux store
    return user; // Return the registered user
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error Code:", errorCode);
    console.error("Error Message:", errorMessage);
    throw error; // Re-throw the error for handling in the calling function
  }
};

// login to Summarist Account

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
    const serializedUser = serializeUser(user); // Serialize the user object
    console.log("User logged in successfully:", serializedUser);
    dispatch(setSummaristLogin(serializedUser)); // Dispatch the user to the Redux store
    // Save user to localStorage
    saveUserToLocalStorage(serializedUser, "summarist");
    return user; // Return the logged-in user
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error Code:", errorCode);
    console.error("Error Message:", errorMessage);
    throw error; // Re-throw the error for handling in the calling function
  }
};

// Guest Log In
export const guestLogin = async (dispatch: AppDispatch): Promise<User | null> => {
  try {
    const userCredential = await signInAnonymously(auth);
    const user = userCredential.user;
    const serializedUser = serializeUser(user); // Serialize the user object
    console.log("Guest signed in successfully:", serializedUser);
    // Save user to localStorage
    saveUserToLocalStorage(serializedUser, "guest");
    dispatch(setGuestLogin(serializedUser)); // Dispatch the user to the Redux store
    return user; // Return the guest user
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error Code:", errorCode);
    console.error("Error Message:", errorMessage);
    throw error; // Re-throw the error for handling in the calling function
  }
};

// Sign out
export const logoutUser = async (dispatch: AppDispatch): Promise<void> => {
  try {
    await signOut(auth);
    // Remove user from localStorage
    removeUserFromLocalStorage();
    console.log("User signed out successfully.");
    dispatch(setLoggedOut());
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error Code:", errorCode);
    console.error("Error Message:", errorMessage);
    throw error; // Re-throw the error for handling in the calling function
  }
}
// Password Reset 
export const forgotPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent successfully.");
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error Code:", errorCode);
    console.error("Error Message:", errorMessage);
    throw error; // Re-throw the error for handling in the calling function
  }
};


