import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Book {
  id: string;
  imageLink: string;
  audioLink: string;
  title: string;
  author: string;
  subTitle: string;
  averageRating: number;
}

interface FinishedState {
  finishedBooks: { [id: string]: Book }; // Store finished books by ID
}

const initialState: FinishedState = {
  finishedBooks: {}, // Initially, no books are finished
};

const finishedSlice = createSlice({
  name: "finished",
  initialState, // Use the correct initial state
  reducers: {
    markAsFinished: (state, action: PayloadAction<Book>) => {
      const { id, audioLink, imageLink, title, author, subTitle, averageRating } = action.payload;

      // Add the book to the finishedBooks object using the ID as the key
      state.finishedBooks[id] = { id, audioLink, imageLink, title, author, subTitle, averageRating };
    },
  },
});

export const { markAsFinished } = finishedSlice.actions;
export default finishedSlice.reducer;