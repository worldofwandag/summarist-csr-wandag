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
    // Toggle the saved state of a book
    toggleSavedState: (state, action: PayloadAction<Book>) => {
      const book = action.payload;
      if (state.savedBooks[book.id]) {
        delete state.savedBooks[book.id]; // Remove book if already saved
      } else {
        state.savedBooks[book.id] = book; // Save book details
      }
    },

    // Save a book explicitly
    saveBook: (state, action: PayloadAction<Book>) => {
      const book = action.payload;
      state.savedBooks[book.id] = book; // Save the book details
    },

    // Remove a book explicitly by ID
    removeBook: (state, action: PayloadAction<string>) => {
      const bookId = action.payload;
      delete state.savedBooks[bookId]; // Remove the book by ID
    },

    // Load saved books from localStorage for a specific user
    loadSavedBooks: (state, action: PayloadAction<{ userId: string }>) => {
      const { userId } = action.payload;
      const savedBooks = localStorage.getItem(`savedBooks_${userId}`);
      if (savedBooks) {
        state.savedBooks = JSON.parse(savedBooks);
      }
    },

    // Clear saved books (e.g., on logout)
    clearSavedBooks: (state) => {
      state.savedBooks = {}; // Clear the savedBooks state
    },
  },
});

export const {
  toggleSavedState,
  saveBook,
  removeBook,
  loadSavedBooks,
  clearSavedBooks,
} = librarySlice.actions;
export default librarySlice.reducer;