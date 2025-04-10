import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import logo from "../assets/logo.png";
import { useRouter } from "next/navigation";
import { BookTypes } from "../utility/bookTypes";

function Searchbar() {
  const [books, setBooks] = useState<BookTypes[]>([]); // State to store books
  const [search, setSearch] = useState(""); // State to store the search input
  const [debouncedSearch, setDebouncedSearch] = useState(""); // State for debounced search input
  const [isLoading, setIsLoading] = useState(false); // State to track loading state
  const router = useRouter(); // Initialize Next.js router
  const searchWrapperRef = useRef<HTMLDivElement>(null); // Ref for the search wrapper

  // Debounce logic: Update `debouncedSearch` 300ms after the user stops typing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => {
      clearTimeout(handler); // Clear the timeout if the user types again within 300ms
    };
  }, [search]);

  // Fetch books when `debouncedSearch` changes
  useEffect(() => {
    const searchBooks = async () => {
      if (!debouncedSearch) {
        setBooks([]); // Clear results if the search input is empty
        setIsLoading(false);
        return;
      }

      setIsLoading(true); // Set loading state to true while fetching
      try {
        const data = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${debouncedSearch}`
        );
        const books: BookTypes[] = await data.json(); // Ensure the response is typed as `BookTypes[]`
        setBooks(books); // Update state with fetched books
      } catch (error) {
        console.error("Failed to fetch books:", error);
      } finally {
        setIsLoading(false); // Set loading state to false after fetching
      }
    };

    searchBooks();
  }, [debouncedSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setIsLoading(true); // Show skeleton loading state immediately when user types
  };

  const handleClearSearch = () => {
    setSearch(""); // Clear the search input
    setBooks([]); // Clear the search results
  };

  const handleResultClick = (bookId: string) => {
    handleClearSearch(); // Clear the search input and results
    router.push(`/book/${bookId}`); // Navigate to the book details page
  };

  // Close the search results when clicking outside the search wrapper
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(event.target as Node)
      ) {
        handleClearSearch(); // Clear the search input and results
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="search__background">
        <div className="search__wrapper" ref={searchWrapperRef}>
          <figure>
            <Image
              className="search__image"
              src={logo}
              alt="Search Background"
              height={1}
              width={0}
            />
          </figure>
          <div className="search__content">
            <div className="search">
              <div className="search__input--wrapper">
                <input
                  className="search__input text-xs text-red-300"
                  placeholder="Search for books"
                  type="text"
                  value={search}
                  onChange={handleSearchChange} // Update search input state and show skeleton
                />
                <div className="search__icon" onClick={search ? handleClearSearch : undefined}>
                  {search ? (
                    // Close icon (new SVG)
                    <svg
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="0"
                      viewBox="0 0 24 24"
                      className="search__delete--icon"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  ) : (
                    // Magnifying glass icon (original SVG)
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 1024 1024"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"></path>
                    </svg>
                  )}
                </div>
              </div>
            </div>

            {/* SEARCH RESULTS OR LOADING STATE */}
            {search && (
              <div className="search__books--wrapper">
                {isLoading ? (
                  // Skeleton loading state
                  Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={index}
                      className="skeleton"
                      style={{
                        width: "100%",
                        height: "120px",
                        marginBottom: index < 4 ? "8px" : "0", // Add margin except for the last skeleton
                      }}
                    ></div>
                  ))
                ) : books.length > 0 ? (
                  // Render search results
                  books.map((book) => (
                    <div
                      className="search__book--link"
                      key={book.id}
                      onClick={() => handleResultClick(book.id)} // Handle result click
                    >
                      <audio src={book.audioLink}></audio>
                      <figure
                        className="book__image--wrapper"
                        style={{
                          height: "80px",
                          width: "80px",
                          minWidth: "80px",
                        }}
                      >
                        <img
                          className="book__image"
                          src={book.imageLink}
                          alt={book.title}
                          style={{ display: "block" }}
                        />
                      </figure>
                      <div>
                        <div className="search__book--title">{book.title}</div>
                        <div className="search__book--author">
                          {book.author}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // No results found
                  <div className="no-results">No books found</div>
                )}
              </div>
            )}
            {/* END OF SEARCH RESULTS OR LOADING STATE */}
          </div>
        </div>
      </div>
    </>
  );
}

export default Searchbar;