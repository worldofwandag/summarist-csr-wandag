"use client";

import React, { useEffect, useState } from "react";
import { BookTypes } from "@/app/utility/bookTypes"; //for TS
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store"; //for TS
// import { use } from "next/navigation"; // Valid in Next.js Server Components
import { toggleSavedState } from "@/app/redux/librarySlice"; // Import the toggle action
import Modal from "@/app/components/Modal";
import { openLoginModal } from "@/app/redux/modalSlice";
import { useParams, useRouter } from "next/navigation"; // For routing
import Link from "next/link";

function Page() {
  const { id } = useParams() as { id: string };
  const [book, setBook] = useState<BookTypes | null>(null); // State to store book data
  const [isLoading, setIsLoading] = useState(true); // State to track loading
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn); // Check if user is logged in
  const isSaved = useSelector(
    (state: RootState) => state.library.savedBooks[id]
  );
  // Check if the book is saved
  const isSubscribed = useSelector(
    (state: RootState) => state.user.isSubscribed
  ); // Check if user is subscribed
  const isPlusSubscribed = useSelector(
    (state: RootState) => state.user.isPlusSubscribed
  ); // Check if user is plus subscribed
  const { loginModalOpen } = useSelector((state: RootState) => state.modal);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter(); // For navigation

  useEffect(() => {
    if (!id) {
      console.error("Book ID is missing");
      return;
    }

    const fetchBook = async () => {
      try {
        const response = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch book data");
        }
        const data = await response.json();
        setBook(data); // Update state with fetched book data
      } catch (error) {
        console.error("Error fetching book:", error);
      } finally {
        setIsLoading(false); // Set loading state to false
      }
    };

    fetchBook();
  }, [id]);

  if (isLoading) {
    // Skeleton loading state
    return (
      <div className="wrapper">
        <div className="row">
          <div className="container">
            <div className="inner__wrapper">
              <div className="inner__book">
                {/* Skeleton for title */}
                <div
                  className="skeleton"
                  style={{ height: "48px", width: "60%", marginBottom: "16px" }}
                ></div>
                {/* Skeleton for author */}
                <div
                  className="skeleton"
                  style={{ height: "24px", width: "40%", marginBottom: "16px" }}
                ></div>
                {/* Skeleton for subtitle */}
                <div
                  className="skeleton"
                  style={{ height: "20px", width: "50%", marginBottom: "24px" }}
                ></div>
                {/* Skeleton for descriptions in 2 rows and 2 columns */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    marginBottom: "40px",
                  }}
                >
                  <div
                    className="skeleton"
                    style={{ height: "20px", width: "60%" }} // First skeleton box
                  ></div>
                  <div
                    className="skeleton"
                    style={{ height: "20px", width: "60%" }} // Second skeleton box
                  ></div>
                </div>
                {/* Skeleton for Read and Listen buttons side by side */}
                <div
                  style={{ display: "flex", gap: "16px", marginBottom: "16px" }}
                >
                  <div
                    className="skeleton"
                    style={{ height: "48px", width: "21%" }}
                  ></div>
                  <div
                    className="skeleton"
                    style={{ height: "48px", width: "21%" }}
                  ></div>
                </div>
                {/* Skeleton for icon and text side by side */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "36px",
                  }}
                >
                  <div
                    className="skeleton"
                    style={{ height: "24px", width: "3%" }}
                  ></div>
                  <div
                    className="skeleton"
                    style={{ height: "20px", width: "30%" }}
                  ></div>
                </div>
                {/* Skeleton for first secondary title */}
                <div
                  className="skeleton"
                  style={{ height: "28px", width: "30%", marginBottom: "16px" }}
                ></div>
                {/* Skeleton for tags */}
                <div
                  className="skeleton"
                  style={{ height: "48px", width: "25%", marginBottom: "16px" }}
                ></div>
                {/* Skeleton for book description */}
                <div
                  className="skeleton"
                  style={{
                    height: "200px",
                    width: "100%",
                    marginBottom: "24px",
                  }}
                ></div>
                {/* Skeleton for second secondary title */}
                <div
                  className="skeleton"
                  style={{ height: "28px", width: "30%", marginBottom: "16px" }}
                ></div>
                {/* Skeleton for author description */}
                <div
                  className="skeleton"
                  style={{
                    height: "200px",
                    width: "100%",
                    marginBottom: "24px",
                  }}
                ></div>
              </div>
              <div className="inner-book--img-wrapper">
                {/* Skeleton for book image */}
                <div
                  className="book__image--skeleton"
                  style={{
                    height: "300px",
                    width: "300px",
                    minWidth: "300px",
                    backgroundColor: "#e4e4e4",
                    borderRadius: "8px",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleOpenLoginModal = () => {
    dispatch(openLoginModal()); // Dispatch the action to open the login modal
  };

  if (!book) {
    return null; // Or a fallback UI
  }

  const handleReadOrListen = () => {
    if (!book) {
      console.error("Book data is not loaded yet.");
      return;
    }

    if (!isLoggedIn) {
      handleOpenLoginModal(); // Open login modal if user is not logged in
    } else if (!book.subscriptionRequired) {
      router.push(`/player/${book.id}`); // Route to player if subscription is not required
    } else if (
      book.subscriptionRequired &&
      (isSubscribed || isPlusSubscribed)
    ) {
      router.push(`/player/${book.id}`); // Route to player if subscription is required and user is subscribed
    } else if (
      book.subscriptionRequired &&
      !isSubscribed &&
      !isPlusSubscribed
    ) {
      router.push(`/choose-plan`); // Route to choose plan if subscription is required but user is not subscribed
    }
  };

  const handleToggleLibrary = () => {
    if (!isLoggedIn) {
      dispatch(openLoginModal()); // Open login modal if user is not logged in
    } else {
      dispatch(toggleSavedState(book)); // Toggle the saved state of the book
    }
  };

  return (
    <div className="wrapper">
      {loginModalOpen && <Modal />}

      <div className="row">
        <audio src={book.audioLink}></audio>
        <div className="container">
          <div className="inner__wrapper">
            <div className="inner__book">
              <div className="inner-book__title">
                {book.title}{" "}
                {book.subscriptionRequired && !isLoggedIn && (
                  <span>(Premium)</span>
                )}
              </div>
              <div className="inner-book__author">{book.author}</div>
              <div className="inner-book__sub--title">{book.subTitle}</div>
              <div className="inner-book__wrapper">
                <div className="inner-book__description--wrapper">
                  <div className="inner-book__description">
                    <div className="inner-book__icon">
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
                    <div className="inner-book__overall--rating">
                      {book.averageRating}&nbsp;
                    </div>
                    <div className="inner-book__total--rating">
                      ({book.totalRating}&nbsp;ratings)
                    </div>
                  </div>
                  <div className="inner-book__description">
                    <div className="inner-book__icon">
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 1024 1024"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                        <path d="M686.7 638.6L544.1 535.5V288c0-4.4-3.6-8-8-8H488c-4.4 0-8 3.6-8 8v275.4c0 2.6 1.2 5 3.3 6.5l165.4 120.6c3.6 2.6 8.6 1.8 11.2-1.7l28.6-39c2.6-3.7 1.8-8.7-1.8-11.2z"></path>
                      </svg>
                    </div>
                    <div className="inner-book__duration">03:22</div>
                  </div>
                  <div className="inner-book__description">
                    <div className="inner-book__icon">
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 1024 1024"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M842 454c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8 0 140.3-113.7 254-254 254S258 594.3 258 454c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8 0 168.7 126.6 307.9 290 327.6V884H326.7c-13.7 0-24.7 14.3-24.7 32v36c0 4.4 2.8 8 6.2 8h407.6c3.4 0 6.2-3.6 6.2-8v-36c0-17.7-11-32-24.7-32H548V782.1c165.3-18 294-158 294-328.1zM512 624c93.9 0 170-75.2 170-168V232c0-92.8-76.1-168-170-168s-170 75.2-170 168v224c0 92.8 76.1 168 170 168zm-94-392c0-50.6 41.9-92 94-92s94 41.4 94 92v224c0 50.6-41.9 92-94 92s-94-41.4-94-92V232z"></path>
                      </svg>
                    </div>
                    <div className="inner-book__type">{book.type}</div>
                  </div>
                  <div className="inner-book__description">
                    <div className="inner-book__icon">
                      <svg
                        stroke="currentColor"
                        fill="none"
                        strokeWidth="0"
                        viewBox="0 0 24 24"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        ></path>
                      </svg>
                    </div>
                    <div className="inner-book__key--ideas">
                      {book.keyIdeas}
                    </div>
                  </div>
                </div>
              </div>
              <div className="inner-book__read--btn-wrapper">
                <button
                  className="inner-book__read--btn"
                  onClick={handleReadOrListen}
                >
                  <div className="inner-book__read--icon">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 1024 1024"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M928 161H699.2c-49.1 0-97.1 14.1-138.4 40.7L512 233l-48.8-31.3A255.2 255.2 0 0 0 324.8 161H96c-17.7 0-32 14.3-32 32v568c0 17.7 14.3 32 32 32h228.8c49.1 0 97.1 14.1 138.4 40.7l44.4 28.6c1.3.8 2.8 1.3 4.3 1.3s3-.4 4.3-1.3l44.4-28.6C602 807.1 650.1 793 699.2 793H928c17.7 0 32-14.3 32-32V193c0-17.7-14.3-32-32-32zM324.8 721H136V233h188.8c35.4 0 69.8 10.1 99.5 29.2l48.8 31.3 6.9 4.5v462c-47.6-25.6-100.8-39-155.2-39zm563.2 0H699.2c-54.4 0-107.6 13.4-155.2 39V298l6.9-4.5 48.8-31.3c29.7-19.1 64.1-29.2 99.5-29.2H888v488zM396.9 361H211.1c-3.9 0-7.1 3.4-7.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c.1-4.1-3.1-7.5-7-7.5zm223.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c0-4.1-3.2-7.5-7.1-7.5H627.1c-3.9 0-7.1 3.4-7.1 7.5zM396.9 501H211.1c-3.9 0-7.1 3.4-7.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c.1-4.1-3.1-7.5-7-7.5zm416 0H627.1c-3.9 0-7.1 3.4-7.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c.1-4.1-3.1-7.5-7-7.5z"></path>
                    </svg>
                  </div>
                  <div className="inner-book__read--text">Read</div>
                </button>
                <button
                  className="inner-book__read--btn"
                  onClick={handleReadOrListen}
                >
                  <div className="inner-book__read--icon">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 1024 1024"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M842 454c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8 0 140.3-113.7 254-254 254S258 594.3 258 454c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8 0 168.7 126.6 307.9 290 327.6V884H326.7c-13.7 0-24.7 14.3-24.7 32v36c0 4.4 2.8 8 6.2 8h407.6c3.4 0 6.2-3.6 6.2-8v-36c0-17.7-11-32-24.7-32H548V782.1c165.3-18 294-158 294-328.1zM512 624c93.9 0 170-75.2 170-168V232c0-92.8-76.1-168-170-168s-170 75.2-170 168v224c0 92.8 76.1 168 170 168zm-94-392c0-50.6 41.9-92 94-92s94 41.4 94 92v224c0 50.6-41.9 92-94 92s-94-41.4-94-92V232z"></path>
                    </svg>
                  </div>
                  <div className="inner-book__read--text">Listen</div>
                </button>
              </div>

              {isLoggedIn && (
                <div
                  className="inner-book__bookmark"
                  onClick={handleToggleLibrary} // Handle toggle
                >
                  <div className="inner-book__bookmark--icon">
                    <svg
                      stroke="currentColor"
                      fill="#0365f2"
                      strokeWidth="0"
                      viewBox="0 0 16 16"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d={
                          isSaved
                            ? "M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"
                            : "M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"
                        }
                      ></path>
                    </svg>
                  </div>
                  <div className="inner-book__bookmark--text">
                    {isSaved
                      ? "Saved in My Library"
                      : "Add title to My Library"}
                  </div>
                </div>
              )}

              <div className="inner-book__secondary--title">
                What's it about?
              </div>
              <div className="inner-book__tags--wrapper">
                <div className="inner-book__tag">{book.tags}</div>
              </div>
              <div className="inner-book__book--description">
                {book.bookDescription}
              </div>
              <h2 className="inner-book__secondary--title">About the author</h2>
              <div className="inner-book__author--description">
                {book.authorDescription}
              </div>
            </div>
            <div className="inner-book--img-wrapper">
              <figure className="w-[300px] h-[300px]">
                <img
                  src={book.imageLink}
                  alt={book.title}
                  className="book__image"
                />
              </figure>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
