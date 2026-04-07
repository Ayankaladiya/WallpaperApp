import React from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineFolder } from "react-icons/ai";
import { capitalize } from "../../utils/helpers";

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/category/${category.name}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
    >
      {/* Category Icon/Header */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-8 flex items-center justify-center">
        <AiOutlineFolder className="text-white text-6xl group-hover:scale-110 transition-transform" />
      </div>

      {/* Category Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 capitalize group-hover:text-primary-600 transition-colors">
          {capitalize(category.name)}
        </h3>

        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-500">
            {category.count} wallpapers
          </span>
          <span className="bg-primary-100 text-primary-700 text-xs font-semibold px-2 py-1 rounded">
            {category.subcategories.length} subcategories
          </span>
        </div>

        {/* Subcategories */}
        <div className="border-t pt-3">
          <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">
            Subcategories:
          </p>
          <div className="flex flex-wrap gap-1">
            {category.subcategories.slice(0, 3).map((sub) => (
              <span
                key={sub}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded capitalize"
              >
                {sub}
              </span>
            ))}
            {category.subcategories.length > 3 && (
              <span className="text-xs text-gray-400 px-2 py-1">
                +{category.subcategories.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Hover Effect */}
      <div className="bg-primary-600 h-1 w-0 group-hover:w-full transition-all duration-300"></div>
    </div>
  );
};

export default CategoryCard;
