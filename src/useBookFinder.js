import { useState, useEffect } from "react";
import axios from "axios";
export default function useBookFinder(searchQuery, pageNumber) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [books, setBooks] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  useEffect(() => {
    setBooks([]);
  }, [searchQuery]);

  useEffect(() => {
    setIsLoading(true);
    setError(false);
    let cancel;
    axios({
      method: "GET",
      url: "http://openlibrary.org/search.json",
      params: { q: searchQuery, page: pageNumber },
      cancelToken: axios.CancelToken(c => (cancel = c))
    })
      .then(res => {
        setBooks(prevBooks => {
          return [
            ...new Set([...prevBooks, ...res.data.docs.map(book => book.title)])
          ];
        });
        setHasMore(res.data.docs.length > 0);
        setIsLoading(false);
        console.log(res.data);
      })
      .catch(e => {
        setError(true);
        if (axios.isCancel(e)) return;
      });
    return () => cancel();
  }, [searchQuery, pageNumber]);

  return { isLoading, error, hasMore, books };
}
