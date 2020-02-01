import React, { useState, useRef, useCallback } from "react";
import useBookFinder from "./useBookFinder";
import "./App.css";
function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const { isLoading, hasMore, error, books } = useBookFinder(
    searchQuery,
    pageNumber
  );

  const observer = useRef();
  const lastBook = useCallback(
    node => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          setPageNumber(prevPageNum => prevPageNum + 1);
        }
      });
      if (node) observer.current.observe(node);
      console.log(node);
    },
    [isLoading, hasMore]
  );
  const handleSearchQuery = e => {
    setSearchQuery(e.target.value);
    setPageNumber(1);

    console.log(searchQuery);
  };

  return (
    <>
      <h1>BookFinder</h1>
      <input type="text" onChange={handleSearchQuery}></input>
      {books.map((book, index) => {
        if (books.length === index + 1) {
          return (
            <div className="books" ref={lastBook} key={book}>
              {book}
            </div>
          );
        }
        return (
          <div className="books" key={book}>
            {book}
          </div>
        );
      })}
      <div>{isLoading && "Loading..."}</div>
      <div>{error && "Error"}</div>
    </>
  );
}

export default App;
