import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Book {
  id: string;
  imageLink: string;
  title: string;
  author: string;
  subTitle: string;
  averageRating: number;
}

interface LibraryState {
  savedBooks: { [id: string]: Book }; // Store book details by ID
  
}

const initialState: LibraryState = {
  savedBooks: {}, // Initially, no books are saved
  
};

const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {
    toggleSavedState: (state, action: PayloadAction<Book>) => {
      const book = action.payload;
      if (state.savedBooks[book.id]) {
        delete state.savedBooks[book.id]; // Remove book if already saved
      } else {
        state.savedBooks[book.id] = book; // Save book details
      }
    },
    saveBook: (state, action: PayloadAction<Book>) => {
      const book = action.payload;
      state.savedBooks[book.id] = book; // Save the book details
    },
    removeBook: (state, action: PayloadAction<string>) => {
      const bookId = action.payload;
      delete state.savedBooks[bookId]; // Remove the book by ID
    },
  },
});

export const { toggleSavedState, saveBook, removeBook } = librarySlice.actions;
export default librarySlice.reducer;