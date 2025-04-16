import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import logo from "../assets/logo.png";
import { useRouter } from "next/navigation";
import { BookTypes } from "../utility/bookTypes";

interface SearchbarProps {
  handleToggleSidebar: () => void; // Add the toggle function as a prop
}

function Searchbar({ handleToggleSidebar }: SearchbarProps) {
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
                <div
                  className="search__icon"
                  onClick={search ? handleClearSearch : undefined}
                >
                  {/* Icons */}
                </div>
              </div>
            </div>

            {/* SIDEBAR TOGGLE ON SMALLER SCREENS */}
            <div
              className="sidebar__toggle--btn"
              onClick={handleToggleSidebar} // Attach the toggle function here
            >
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="0"
                viewBox="0 0 15 15"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
                  fill="currentColor"
                ></path>
              </svg>
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
