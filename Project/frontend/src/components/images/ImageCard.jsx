// src/components/images/ImageCard.jsx
import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { getImageDownloadUrl } from "../../utils/helpers";
import { AiOutlineEye } from "react-icons/ai";

const ImageCard = ({ image, onClick }) => {
  return (
    <div
      onClick={() => onClick(image)}
      className="group relative cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 bg-gray-200"
    >
      <LazyLoadImage
        src={getImageDownloadUrl(image._id)}
        alt={image.filename}
        effect="blur"
        className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-300"
        wrapperClassName="w-full"
      />

      {/* Overlay on Hover */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center px-4">
          <AiOutlineEye className="text-4xl mx-auto mb-2" />
          <p className="text-sm font-semibold truncate">{image.filename}</p>
          <p className="text-xs text-gray-300">
            {image.width} × {image.height}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
