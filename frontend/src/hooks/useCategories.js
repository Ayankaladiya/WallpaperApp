// src/hooks/useCategories.js
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../services/api";
import { QUERY_KEYS } from "../utils/constants";

export const useCategories = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
