// filepath: c:\Users\jwand\OneDrive\Desktop\FES-PROJECTS\summarist-csr-wandag\app\redux\fontSizeSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const fontSizeSlice = createSlice({
  name: "fontSize",
  initialState: "small", // Default font size
  reducers: {
    setFontSize: (state, action) => action.payload, // Update font size
  },
});

export const { setFontSize } = fontSizeSlice.actions;
export default fontSizeSlice.reducer;