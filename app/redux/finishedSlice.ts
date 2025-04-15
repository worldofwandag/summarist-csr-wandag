import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Book {
  id: string;
  imageLink: string;
  audioLink: string;
  title: string;
  author: string;
  subTitle: string;
  averageRating: number;
  duration: string; // Add the duration property
}

interface FinishedState {
  finishedBooks: { [id: string]: Book }; // Store finished books by ID
}

const initialState: FinishedState = {
  finishedBooks: {}, // Initially, no books are finished
};

const finishedSlice = createSlice({
  name: "finished",
  initialState: {
    finishedBooks: {} as { [id: string]: Book },
  },
  reducers: {
    markAsFinished: (state, action: PayloadAction<Book>) => {
      const book = action.payload;
      state.finishedBooks[book.id] = book;
    },
    clearFinishedBooks: (state) => {
      state.finishedBooks = {}; // Clear all finished books
    },
    loadFinishedBooks: (state, action: PayloadAction<{ [id: string]: Book }>) => {
      // Replace the current finishedBooks state with the loaded data
      state.finishedBooks = action.payload;
    },
    updateFinishedBookDuration: (state, action: PayloadAction<{ id: string; duration: string }>) => {
      const { id, duration } = action.payload;
      if (state.finishedBooks[id]) {
        state.finishedBooks[id].duration = duration;
      }
    },
  },
});

export const { markAsFinished, clearFinishedBooks, loadFinishedBooks, updateFinishedBookDuration } = finishedSlice.actions;
export default finishedSlice.reducer;