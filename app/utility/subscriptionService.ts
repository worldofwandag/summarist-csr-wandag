import { createAsyncThunk } from "@reduxjs/toolkit";
import { auth } from "../firebase/config";

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