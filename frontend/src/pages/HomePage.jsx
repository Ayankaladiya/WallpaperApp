// src/pages/HomePage.jsx
import React, { useState } from "react";
import { useCategories } from "../hooks/useCategories";
import { useSearch } from "../hooks/useSearch";
import { useQuery } from "@tanstack/react-query";
import { getImagesByCategory } from "../services/api";
import CategoryCarousel from "../components/home/CategoryCarousel";
import SearchBar from "../components/search/SearchBar";
import ImageGrid from "../components/images/ImageGrid";
import ImageModal from "../components/images/ImageModal";
import ImageSkeleton from "../components/images/ImageSkeleton";
import InfiniteScrollTrigger from "../components/common/InfiniteScrollTrigger";
import ErrorMessage from "../components/common/ErrorMessage";
import { QUERY_KEYS } from "../utils/constants";

const HomePage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch categories
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  // Fetch random images for "Download Free Wallpapers" section
  const { data: randomImagesData, isLoading: randomImagesLoading } = useQuery({
    queryKey: [QUERY_KEYS.IMAGES, "random"],
    queryFn: () => getImagesByCategory("", 1, 12), // Fetch random images
    staleTime: 5 * 60 * 1000,
  });

  // Search functionality
  const {
    searchQuery,
    setSearchQuery,
    debouncedQuery,
    data: searchData,
    isLoading: searchLoading,
    isFetchingNextPage: searchFetchingMore,
    hasNextPage: searchHasMore,
    fetchNextPage: fetchMoreSearch,
  } = useSearch();

  const categories = categoriesData?.data || [];
  const randomImages = randomImagesData?.data?.images || [];
  const categoriesErrorMsg =
    categoriesError?.response?.data?.message || categoriesError?.message;

  // Flatten all search result pages
  const searchImages =
    searchData?.pages?.flatMap((page) => page.data.images) || [];
  const showSearchResults = debouncedQuery.length > 0;

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Results */}
      {showSearchResults && (
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Search Results for "{debouncedQuery}"
          </h2>

          {searchLoading && <ImageSkeleton count={8} />}

          {!searchLoading && searchImages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No results found for "{debouncedQuery}"
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Try different keywords or browse categories below
              </p>
            </div>
          )}

          {!searchLoading && searchImages.length > 0 && (
            <>
              <ImageGrid
                images={searchImages}
                onImageClick={handleImageClick}
              />
              <InfiniteScrollTrigger
                onIntersect={fetchMoreSearch}
                hasMore={searchHasMore}
                isFetching={searchFetchingMore}
              />
            </>
          )}
        </div>
      )}

      {/* Main Content (when not searching) */}
      {!showSearchResults && (
        <>
          {/* Category Carousel Section */}
          <div className="bg-white py-8 border-b border-gray-200">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Popular categories
              </h2>
              {categoriesLoading && (
                <div className="flex space-x-4 overflow-x-auto">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="min-w-[200px] h-[120px] bg-gray-200 rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              )}
              {categoriesErrorMsg && (
                <ErrorMessage message={categoriesErrorMsg} />
              )}
              {!categoriesLoading && !categoriesErrorMsg && (
                <CategoryCarousel categories={categories} />
              )}
            </div>
          </div>

          {/* Random Images Section */}
          <div className="container mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Download Free Wallpapers
            </h2>

            {randomImagesLoading && <ImageSkeleton count={12} />}

            {!randomImagesLoading && randomImages.length > 0 && (
              <ImageGrid
                images={randomImages}
                onImageClick={handleImageClick}
              />
            )}

            {!randomImagesLoading && randomImages.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No wallpapers available yet
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Image Modal */}
      <ImageModal
        image={selectedImage}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default HomePage;
