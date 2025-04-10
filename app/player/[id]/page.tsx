"use client";

import React, { useEffect, useState } from "react";
import { BookTypes } from "@/app/utility/bookTypes"; // For TypeScript
import { use } from "react"; // For params because params is a promise in Next.js now
import AudioPlayer from "@/app/components/AudioPlayer";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";

export default function Page({ params}: { params: Promise<{ id: string }>; }) {
  const { id } = use(params); // Unwrap `params` using `use()`
  const [book, setBook] = useState<BookTypes | null>(null); // State to store book data
  const [isLoading, setIsLoading] = useState(true); // State to track loading state
  const fontSize = useSelector((state: RootState) => state.fontSize);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`
        );
        if (!data.ok) {
          throw new Error("Failed to fetch data");
        }
        const book = await data.json();
        setBook(book); // Update state with fetched book data
      } catch (error) {
        console.error("Failed to fetch book:", error);
      } finally {
        setIsLoading(false); // Ensure loading state is updated after the API call
      }
    };

    fetchBook();
  }, [id]); // Dependency array ensures this runs when `id` changes

  if (!book) {
    return <div>Loading...</div>; // Show a loading state while fetching data
  }

  return (
    <div className="wrapper">
      <div className="summary">
        <div className="audio__book--summary">
          <div className="audio__book--summary-title">
            <b>{book?.title || "Loading..."}</b>
          </div>
          <div
            className="audio-book--summary-text"
            style={{
              fontSize:
                fontSize === "small"
                  ? "16px"
                  : fontSize === "medium"
                  ? "18px"
                  : fontSize === "large"
                  ? "20px"
                  : "24px", // xlarge
            }}
          >
            {book.summary}
          </div>
        </div>

        {/* Always render the AudioPlayer */}
        <AudioPlayer
          audioLink={book?.audioLink || ""} // Pass an empty string if not loaded
          imageLink={book?.imageLink || ""}
          title={book?.title || ""}
          author={book?.author || ""}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
