// src/components/search/SearchBar.jsx
import React from "react";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";

const SearchBar = ({
  value,
  onChange,
  onClear,
  placeholder = "Search wallpapers...",
}) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <AiOutlineSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-4 text-lg border-2 border-gray-200 rounded-full focus:outline-none focus:border-primary-500 transition-colors"
        />
        {value && (
          <button
            onClick={onClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <AiOutlineClose className="text-xl" />
          </button>
        )}
      </div>
      {value && (
        <p className="text-sm text-gray-500 mt-2 text-center">
          Searching for "{value}"...
        </p>
      )}
    </div>
  );
};

export default SearchBar;
