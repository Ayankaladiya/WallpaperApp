// src/hooks/useInfiniteImages.js
import { useInfiniteQuery } from "@tanstack/react-query";
import { getImagesByCategory } from "../services/api";
import { QUERY_KEYS, ITEMS_PER_PAGE } from "../utils/constants";

export const useInfiniteImages = (category) => {
  console.log(`Infinite images from :${category}`);
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.IMAGES, category],
    queryFn: ({ pageParam = 1 }) =>
      getImagesByCategory(category, pageParam, ITEMS_PER_PAGE),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!category,
  });
};
