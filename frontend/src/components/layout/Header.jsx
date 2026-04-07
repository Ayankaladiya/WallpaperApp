// src/components/layout/Header.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AiOutlinePicture,
  AiOutlineSearch,
  AiOutlineClose,
} from "react-icons/ai";
import debounce from "lodash.debounce";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const handleSearch = debounce((query) => {
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query)}`);
    }
  }, 500);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    handleSearch(value);
  };

  const handleClear = () => {
    setSearchQuery("");
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 group flex-shrink-0"
          >
            <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
              <AiOutlinePicture className="text-white text-2xl" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent hidden sm:inline">
              WallpaperHub
            </span>
          </Link>

          {/* Search Bar - Center */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <AiOutlineSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Search for wallpapers..."
                className={`w-full pl-12 pr-12 py-3 border-2 rounded-full transition-all duration-200 outline-none ${
                  isFocused
                    ? "border-primary-500 shadow-md"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              />
              {searchQuery && (
                <button
                  onClick={handleClear}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <AiOutlineClose className="text-xl" />
                </button>
              )}
            </div>
          </div>

          {/* Right Side - Empty for now, can add user menu later */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <span className="text-sm text-gray-600 hidden md:inline">
              Free HD Wallpapers
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
