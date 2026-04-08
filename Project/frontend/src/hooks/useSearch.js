// src/hooks/useSearch.js
import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import { searchImages } from "../services/api";
import { QUERY_KEYS, DEBOUNCE_DELAY, ITEMS_PER_PAGE } from "../utils/constants";

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search input
  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedQuery(searchQuery);
    }, DEBOUNCE_DELAY);

    handler();

    return () => {
      handler.cancel();
    };
  }, [searchQuery]);

  const query = useInfiniteQuery({
    queryKey: [QUERY_KEYS.SEARCH, debouncedQuery],
    queryFn: ({ pageParam = 1 }) =>
      searchImages(debouncedQuery, pageParam, ITEMS_PER_PAGE),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: debouncedQuery.length > 0,
  });

  return {
    searchQuery,
    setSearchQuery,
    debouncedQuery,
    ...query,
  };
};
