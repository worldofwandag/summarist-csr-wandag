"use client";

import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux";
import store from "./redux/store";
import BarComponents from "./components/BarComponents";
import { useEffect } from "react";
import {
  setGoogleLogin,
  setSummaristLogin,
  setGuestLogin,
  setSubscribed,
  setPlusSubscribed,
} from "./redux/userSlice"; // Import subscription actions
import { loadSavedBooks } from "./redux/librarySlice"; // Import action to load saved books
import { loadFinishedBooks } from "./redux/finishedSlice"; // Import action to load finished books

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const metadata: Metadata = {
  title: "summarist.wandag",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Rehydration logic
  useEffect(() => {
    // Ensure this logic only runs on the client side
    if (typeof window === "undefined") return;

    try {
      const storedUser = localStorage.getItem("user");
      const loginType = localStorage.getItem("loginType"); // Store login type (e.g., "google", "summarist", "guest")
      const isSubscribed = JSON.parse(
        localStorage.getItem("isSubscribed") || "false"
      );
      const isPlusSubscribed = JSON.parse(
        localStorage.getItem("isPlusSubscribed") || "false"
      );

      if (storedUser && loginType) {
        const user = JSON.parse(storedUser);

        if (loginType === "google") {
          store.dispatch(setGoogleLogin(user));
        } else if (loginType === "summarist") {
          store.dispatch(setSummaristLogin(user));
        } else if (loginType === "guest") {
          store.dispatch(setGuestLogin(user));
        }

        store.dispatch(setSubscribed(isSubscribed));
        store.dispatch(setPlusSubscribed(isPlusSubscribed));
      }

      // Rehydrate savedBooks
      const savedBooks = localStorage.getItem("savedBooks");
      if (savedBooks) {
        store.dispatch(loadSavedBooks(JSON.parse(savedBooks)));
      }

      // Rehydrate finishedBooks
      const finishedBooks = localStorage.getItem("finishedBooks");
      if (finishedBooks) {
        store.dispatch(loadFinishedBooks(JSON.parse(finishedBooks)));
      }
    } catch (error) {
      console.error("Error during rehydration:", error);
    }
  }, []);

  return (
    <html lang="en">
      <body className={`${roboto.className}`}>
        <Provider store={store}>
        
          <BarComponents />
          {children}
          
        </Provider>
        
      </body>
    </html>
  );
}