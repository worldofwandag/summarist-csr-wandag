"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BookTypes } from "../utility/bookTypes";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { updateBookDuration } from "../redux/librarySlice"; // Import the action
import { formatTime } from "../utility/formatTime"; // Import the time formatting utility

export default function Suggested() {
  const [books, setBooks] = useState<BookTypes[]>([]); // State to store books
  const [isLoading, setIsLoading] = useState(true); // State to track loading state
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn); // Access Redux state
  const isSubscribed = useSelector(
    (state: RootState) => state.user.isSubscribed
  ); // Check if user is subscribed
  const isPlusSubscribed = useSelector(
    (state: RootState) => state.user.isPlusSubscribed
  ); // Check if user is plus subscribed
  const savedBooks = useSelector((state: RootState) => state.library.savedBooks); // Access saved books from Redux
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested`
        );
        const books = await data.json();
        setBooks(books); // Update state with fetched books
      } catch (error) {
        console.error("Failed to fetch books:", error);
      } finally {
        setIsLoading(false); // Set loading state to false after fetching
      }
    };

    fetchBooks();
  }, []);

  const handleLoadedMetadata = (audioElement: HTMLAudioElement, bookId: string) => {
    const audioDuration = audioElement.duration;
    dispatch(updateBookDuration({ id: bookId, duration: formatTime(audioDuration) }));
  };

  return (
    <div>
      <div className="for-you__title">Suggested Books</div>
      <div className="for-you__sub--title">Browse those books</div>
      <div className="for-you__recommended--books">
        {isLoading ? (
          // Skeleton loading state
          <div className="recommended__books--skeleton-wrapper">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="recommended__books--skeleton"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  paddingTop: "32px",
                  paddingBottom: "32px",
                }}
              >
                {/* Skeleton for book image */}
                <div
                  className="skeleton"
                  style={{
                    height: "172px",
                    width: "60%",
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                ></div>
                {/* Skeleton for book title */}
                <div
                  className="skeleton"
                  style={{
                    height: "20px",
                    width: "80%",
                    borderRadius: "4px",
                  }}
                ></div>
                {/* Skeleton for book author */}
                <div
                  className="skeleton"
                  style={{
                    height: "16px",
                    width: "60%",
                    borderRadius: "4px",
                  }}
                ></div>
                {/* Skeleton for book subtitle */}
                <div
                  className="skeleton"
                  style={{
                    height: "16px",
                    width: "70%",
                    borderRadius: "4px",
                  }}
                ></div>
                {/* Skeleton for book details */}
                <div
                  className="skeleton"
                  style={{
                    height: "24px",
                    width: "50%",
                    borderRadius: "4px",
                  }}
                ></div>
              </div>
            ))}
          </div>
        ) : (
          books.map((book: BookTypes) => (
            <Link href={`/book/${book.id}`} key={book.id}>
              <div className="for-you__recommended--books-link">
                {book.subscriptionRequired &&
                  ((!isLoggedIn) ||
                    (isLoggedIn && !isSubscribed && !isPlusSubscribed)) && (
                    <div className="book__pill book__pill--subscription-required">
                      Premium
                    </div>
                  )}
                <audio
                  src={book.audioLink}
                  onLoadedMetadata={(e) =>
                    handleLoadedMetadata(e.currentTarget, book.id)
                  }
                ></audio>
                <figure className="book__image--wrapper">
                  <img src={book.imageLink} alt={book.title}></img>
                </figure>
                <div className="recommended__book--title">{book.title}</div>
                <div className="recommended__book--author">{book.author}</div>
                <div className="recommended__book--sub-title">
                  {book.subTitle}
                </div>
                <div className="recommended__book--details-wrapper">
                  <div className="recommended__book--details">
                    <div className="recommended__book--details-icon">
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 24 24"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path>
                        <path d="M13 7h-2v6h6v-2h-4z"></path>
                      </svg>
                    </div>
                    <div className="recommended__book--details-text">
                      {savedBooks[book.id]?.duration || "Loading..."}
                    </div>
                  </div>
                  <div className="recommended__book--details">
                    <div className="recommended__book--details-icon">
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 1024 1024"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 0 0 .6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0 0 46.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3zM664.8 561.6l36.1 210.3L512 672.7 323.1 772l36.1-210.3-152.8-149L417.6 382 512 190.7 606.4 382l211.2 30.7-152.8 148.9z"></path>
                      </svg>
                    </div>
                    <div className="recommended__book--details-text">
                      {book.averageRating}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}