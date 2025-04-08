import { createSlice } from "@reduxjs/toolkit";

// Define types for the modal slice
interface ModalState {
  loginModalOpen: boolean;
  signupModalOpen: boolean;
  isRegistering: boolean; // New state to track registration mode
}

const initialState: ModalState = {
  loginModalOpen: false,
  signupModalOpen: false,
  isRegistering: false, // Default to false (login mode)
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openLoginModal: (state) => {
      state.loginModalOpen = true;
      state.signupModalOpen = false;
      state.isRegistering = false; // Ensure it's in login mode
    },
    closeLoginModal: (state) => {
      state.loginModalOpen = false;
    },
    openSignupModal: (state) => {
      state.signupModalOpen = true;
      state.loginModalOpen = false;
      state.isRegistering = true; // Ensure it's in registration mode
    },
    closeSignupModal: (state) => {
      state.signupModalOpen = false;
    },
    toggleRegistering: (state) => {
      state.isRegistering = !state.isRegistering; // Toggle between login and registration
    },
  },
});

export const {
  openLoginModal,
  closeLoginModal,
  openSignupModal,
  closeSignupModal,
  toggleRegistering,
} = modalSlice.actions;

export default modalSlice.reducer;