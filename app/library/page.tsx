"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/app/redux/store";
import Link from "next/link"; // Import Link for client-side navigation
import { updateBookDuration } from "@/app/redux/librarySlice"; // Import the action
import { updateFinishedBookDuration } from "@/app/redux/finishedSlice"; // Import the action for finished books
import { formatTime } from "@/app/utility/formatTime"; // Import the time formatting utility

const Page = () => {
  const savedBooks = useSelector(
    (state: RootState) => state.library.savedBooks
  ); // Get saved books from Redux
  const finishedBooks = useSelector(
    (state: RootState) => state.finished.finishedBooks
  ); // Get finished books from Redux
  const savedBookList = Object.values(savedBooks); // Convert savedBooks object to an array
  const finishedBookList = Object.values(finishedBooks); // Convert finishedBooks object to an array
  const dispatch = useDispatch<AppDispatch>();

  const handleLoadedMetadata = (
    audioElement: HTMLAudioElement,
    bookId: string,
    isFinished: boolean
  ) => {
    const audioDuration = audioElement.duration;

    if (isFinished) {
      // Update duration for finished books
      dispatch(
        updateFinishedBookDuration({
          id: bookId,
          duration: formatTime(audioDuration),
        })
      );
    } else {
      // Update duration for saved books
      dispatch(
        updateBookDuration({ id: bookId, duration: formatTime(audioDuration) })
      );
    }
  };

  return (
    <div className="wrapper">
      <div className="row">
        <div className="container">
          <div className="for-you__title">Saved Books</div>
          <div className="for-you__sub--title">
            {savedBookList.length} items
          </div>

          {/* DEFAULT STATE WITHOUT SAVED BOOKS */}
          {savedBookList.length === 0 && (
            <div className="finished__books--block-wrapper">
              <div className="finished__books--title">
                Save your favorite books!
              </div>
              <div className="finished__books--sub-title">
                When you save a book, it will appear here.
              </div>
            </div>
          )}

          {/* SAVED BOOKS */}
          {savedBookList.length > 0 && (
            <div className="for-you__recommended--books">
              {savedBookList.map((book) => (
                <Link
                  key={book.id}
                  href={`/book/${book.id}`}
                  className="for-you__recommended--books-link"
                >
                  <audio
                    src={book.audioLink}
                    onLoadedMetadata={
                      (e) =>
                        handleLoadedMetadata(e.currentTarget, book.id, true) // Pass true for finished books
                    }
                  ></audio>
                  <figure
                    className="book__image--wrapper"
                    style={{ marginBottom: "8px" }}
                  >
                    <img
                      className="book__image"
                      src={book.imageLink}
                      alt={book.title}
                      style={{ display: "block" }}
                    ></img>
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
                </Link>
              ))}
            </div>
          )}

          <div className="for-you__title">Finished</div>
          <div className="for-you__sub--title">
            {finishedBookList.length} items
          </div>

          {/* FINISHED BOOKS initial state */}
          {finishedBookList.length === 0 && (
            <div className="finished__books--block-wrapper">
              <div className="finished__books--title">Done and Dusted!</div>
              <div className="finished__books--sub-title">
                When you finish a book, you can find it here later.
              </div>
            </div>
          )}

          {/* FINISHED BOOKS if any exist */}
          {finishedBookList.length > 0 && (
            <div className="for-you__recommended--books">
              {finishedBookList.map((book, index) => (
                <Link
                  key={`${book.id}-${index}`}
                  href={`/book/${book.id}`}
                  className="for-you__recommended--books-link"
                >
                  <audio
                    src={book.audioLink}
                    onLoadedMetadata={
                      (e) =>
                        handleLoadedMetadata(e.currentTarget, book.id, true) // Pass true for finished books
                    }
                  ></audio>
                  <figure
                    className="book__image--wrapper"
                    style={{ marginBottom: "8px" }}
                  >
                    <img
                      className="book__image"
                      src={book.imageLink}
                      alt={book.title}
                      style={{ display: "block" }}
                    ></img>
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
                          <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8.3.589 8 8-3.589 8-8 8z"></path>
                          <path d="M13 7h-2v6h6v-2h-4z"></path>
                        </svg>
                      </div>
                      <div className="recommended__book--details-text">
                        {finishedBooks[book.id]?.duration || "Loading..."}
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
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
