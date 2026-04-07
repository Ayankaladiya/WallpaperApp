// src/components/home/CategoryCarousel.jsx
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { capitalize } from "../../utils/helpers";

const CategoryCarousel = ({ categories }) => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = 250;

    if (direction === "left") {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${categoryName}`);
  };

  // Map category names to preview images
  const getCategoryImage = (categoryName) => {
    // Map to preview folder images
    const imageMap = {
      android: "/preview/android.jpg",
      animals: "/preview/animals.jpg",
      app: "/preview/app.jpg",
      art: "/preview/art.jpg",
      cars: "/preview/cars.jpg",
      colors: "/preview/colors.jpg",
      company: "/preview/company.jpg",
      nature: "/preview/nature.jpg",
      technology: "/preview/technology.jpg",
      space: "/preview/space.jpg",
    };

    return imageMap[categoryName] || "/preview/default.jpg";
  };

  return (
    <div className="relative group">
      {/* Left Arrow */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-label="Scroll left"
      >
        <AiOutlineLeft className="text-xl text-gray-800" />
      </button>

      {/* Carousel Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {categories.map((category) => (
          <div
            key={category._id}
            onClick={() => handleCategoryClick(category._id)}
            className="min-w-[200px] h-[120px] relative rounded-lg overflow-hidden cursor-pointer flex-shrink-0 group/card transition-transform hover:scale-105"
          >
            {/* Category Image */}
            <img
              src={getCategoryImage(category._id)}
              alt={capitalize(category._id)}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="120"%3E%3Crect width="200" height="120" fill="%23' +
                  ["3b82f6", "8b5cf6", "ec4899", "14b8a6", "f59e0b"][
                    Math.floor(Math.random() * 5)
                  ] +
                  '"/%3E%3C/svg%3E';
              }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            {/* Category Name */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-semibold text-lg">
                HD {capitalize(category._id)} Wallpapers
              </h3>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-label="Scroll right"
      >
        <AiOutlineRight className="text-xl text-gray-800" />
      </button>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default CategoryCarousel;
