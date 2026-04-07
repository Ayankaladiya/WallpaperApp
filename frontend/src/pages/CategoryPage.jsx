// src/pages/CategoryPage.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useInfiniteImages } from "../hooks/useInfiniteImages.js";
import ImageGrid from "../components/images/ImageGrid.jsx";
import ImageModal from "../components/images/ImageModal.jsx";
import ImageSkeleton from "../components/images/ImageSkeleton.jsx";
import InfiniteScrollTrigger from "../components/common/InfiniteScrollTrigger.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { capitalize } from "../utils/helpers.js";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data,
    isLoading,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteImages(categoryName);

  console.log(`All the data :${data}`);
  // Flatten all pages
  const images = data?.pages?.flatMap((page) => page.data.images) || [];
  const totalImages = data?.pages?.[0]?.data?.total || 0;

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold mb-4 transition-colors"
        >
          <AiOutlineArrowLeft />
          <span>Back to Home</span>
        </button>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2 capitalize">
          {capitalize(categoryName)} Wallpapers
        </h1>
        {!isLoading && !error && (
          <p className="text-gray-600 text-lg">
            {totalImages} wallpapers available
          </p>
        )}
      </div>

      {/* Loading State */}
      {isLoading && <ImageSkeleton count={12} />}

      {/* Error State */}
      {error && (
        <ErrorMessage
          message={error?.response?.data?.message || error?.message}
        />
      )}

      {/* Images Grid */}
      {!isLoading && !error && (
        <>
          <ImageGrid images={images} onImageClick={handleImageClick} />

          {/* Infinite Scroll */}
          <InfiniteScrollTrigger
            onIntersect={fetchNextPage}
            hasMore={hasNextPage}
            isFetching={isFetchingNextPage}
          />
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

export default CategoryPage;
