// src/components/images/ImageModal.jsx
import React, { useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import {
  getImageDownloadUrl,
  formatFileSize,
  formatResolution,
  capitalize,
  downloadImage,
} from "../../utils/helpers";

const ImageModal = ({ image, isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !image) return null;

  const handleDownload = () => {
    downloadImage(image._id, image.filename);
    toast.success("Download started!");
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors"
        aria-label="Close"
      >
        <AiOutlineClose className="text-2xl" />
      </button>

      {/* Modal Content */}
      <div
        className="flex flex-col items-center max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Container */}
        <div className="relative w-full">
          <img
            src={getImageDownloadUrl(image._id)}
            alt={image.filename}
            className="w-full max-h-[60vh] object-contain rounded-lg"
          />
          {/* Filename overlay on image */}
          <div className="absolute bottom-0 left-0 p-4">
            <h2 className="text-white font-bold text-xl drop-shadow-lg">
              {image.filename}
            </h2>
          </div>
        </div>

        {/* Details Panel */}
        <div className="w-full pt-4 pb-2 px-2">
          {/* Metadata Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
            <div>
              <p className="text-gray-400 text-xs mb-1">Resolution</p>
              <p className="text-white font-semibold">
                {formatResolution(image.width, image.height)}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Size</p>
              <p className="text-white font-semibold">
                {formatFileSize(image.size)}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Orientation</p>
              <p className="text-white font-semibold capitalize">
                {image.orientation}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Aspect Ratio</p>
              <p className="text-white font-semibold">{image.aspectRatio}</p>
            </div>
          </div>

          {/* Category Badges */}
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              {capitalize(image.category)}
            </span>
            {image.subcategory && (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {capitalize(image.subcategory)}
              </span>
            )}
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Download Wallpaper
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
