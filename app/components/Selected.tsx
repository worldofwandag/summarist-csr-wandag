"use client";

import React, { useState, useEffect } from "react";
import { BookTypes } from "../utility/bookTypes";
import Link from "next/link";

export default function Selected() {
  const [selectedPosts, setSelectedPosts] = useState<BookTypes[]>([]);
  const [isLoading, setIsLoading] = useState(true); // State to track loading

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected`
        );
        const books = await data.json();
        setSelectedPosts(books); // Update state with fetched books
      } catch (error) {
        console.error("Failed to fetch books:", error);
      } finally {
        setIsLoading(false); // Set loading state to false after fetching
      }
    };

    fetchBooks();
  }, []);

  return (
    <>
      <div className="for-you__title">Selected just for you</div>
      {isLoading ? (
        // Single skeleton loading box
        <div
          className="selected__book--skeleton"
          
        ></div>
      ) : (
        selectedPosts.map((selectedPost: BookTypes) => (
          <div key={selectedPost.id}>
            <audio src={selectedPost.audioLink} />

            <Link
              href={`/book/${selectedPost.id}`}
              key={selectedPost.id}
              className="selected__book"
            >
              <div className="selected__book--sub-title">
                {selectedPost.subTitle}
              </div>

              <div className="selected__book--line"></div>
              <div className="selected__book--content">
                <figure className="book__image--wrapper--selected">
                  <img
                    className="book__image"
                    src={selectedPost.imageLink}
                    alt={selectedPost.title}
                  />
                </figure>
                <div className="selected__book--text">
                  <div className="selected__book--title">
                    {selectedPost.title}
                  </div>
                  <div className="selected__book--author">
                    {selectedPost.author}
                  </div>
                  <div className="selected__book--duration-wrapper">
                    <div className="selected__book--icon">
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 16 16"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>
                      </svg>
                    </div>
                    <div className="selected__book--duration">3 mins 23 secs</div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))
      )}
    </>
  );
}