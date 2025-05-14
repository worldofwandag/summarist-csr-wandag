"use client";

import React, { useEffect, useState } from "react";
import { BookTypes } from "@/app/utility/bookTypes"; // For TypeScript
import AudioPlayer from "@/app/components/AudioPlayer";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null); // State to store the book ID
  const [book, setBook] = useState<BookTypes | null>(null); // State to store book data
  const [isLoading, setIsLoading] = useState(true); // State to track loading state
  const fontSize = useSelector((state: RootState) => state.fontSize);

  // Resolve the `params` promise and fetch the book data
  useEffect(() => {
    const resolveParamsAndFetchBook = async () => {
      try {
        const resolvedParams = await params; // Resolve the `params` promise
        setId(resolvedParams.id); // Set the book ID

        const response = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${resolvedParams.id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const bookData = await response.json();
        setBook(bookData); // Update state with fetched book data
      } catch (error) {
        console.error("Failed to fetch book:", error);
      } finally {
        // Simulate a loading delay of 100ms
        setTimeout(() => {
          setIsLoading(false); // Ensure loading state is updated after the delay
        }, 100);
      }
    };

    resolveParamsAndFetchBook();
  }, [params]); // Dependency array ensures this runs when `params` changes

  if (isLoading) {
    // Show the loading spinner while loading
    return (
      <div className="wrapper">
        <div className="summary">
          <div className="audio__book--spinner">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              version="1.1"
              viewBox="0 0 16 16"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 16c-2.137 0-4.146-0.832-5.657-2.343s-2.343-3.52-2.343-5.657c0-1.513 0.425-2.986 1.228-4.261 0.781-1.239 1.885-2.24 3.193-2.895l0.672 1.341c-1.063 0.533-1.961 1.347-2.596 2.354-0.652 1.034-0.997 2.231-0.997 3.461 0 3.584 2.916 6.5 6.5 6.5s6.5-2.916 6.5-6.5c0-1.23-0.345-2.426-0.997-3.461-0.635-1.008-1.533-1.822-2.596-2.354l0.672-1.341c1.308 0.655 2.412 1.656 3.193 2.895 0.803 1.274 1.228 2.748 1.228 4.261 0 2.137-0.832 4.146-2.343 5.657s-3.52 2.343-5.657 2.343z"></path>
            </svg>
          </div>
        </div>
      </div>
    );
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
            {book?.summary}
          </div>
        </div>

        {/* Always render the AudioPlayer */}
        <AudioPlayer
          audioLink={book?.audioLink || ""} // Pass an empty string if not loaded
          imageLink={book?.imageLink || ""}
          title={book?.title || ""}
          author={book?.author || ""}
          bookId={id || ""} // Pass the book ID to the AudioPlayer
          subTitle={book?.subTitle || ""}
          averageRating={book?.averageRating || 0} // Pass averageRating with a default value of 0
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
