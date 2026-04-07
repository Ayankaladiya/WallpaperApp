// src/components/images/ImageModal.jsx
import React from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { toast } from "react-toastify";
import {
  getImageDownloadUrl,
  formatFileSize,
  formatResolution,
  capitalize,
  downloadImage,
} from "../../utils/helpers";

const ImageModal = ({ image, isOpen, onClose }) => {
  if (!image) return null;

  const handleDownload = () => {
    downloadImage(image._id, image.filename);
    toast.success("Download started!");
  };

  const slides = [
    {
      src: getImageDownloadUrl(image._id),
      alt: image.filename,
    },
  ];

  return (
    <Lightbox
      open={isOpen}
      close={onClose}
      slides={slides}
      render={{
        buttonPrev: () => null,
        buttonNext: () => null,
        slide: ({ slide }) => (
          <div className="flex flex-col items-center justify-center h-full">
            <img
              src={slide.src}
              alt={slide.alt}
              className="max-w-full max-h-[80vh] object-contain"
            />

            {/* Image Details Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-white text-2xl font-bold mb-4">
                  {image.filename}
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white text-sm mb-4">
                  <div>
                    <p className="text-gray-400">Resolution</p>
                    <p className="font-semibold">
                      {formatResolution(image.width, image.height)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Size</p>
                    <p className="font-semibold">
                      {formatFileSize(image.size)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Orientation</p>
                    <p className="font-semibold capitalize">
                      {image.orientation}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Aspect Ratio</p>
                    <p className="font-semibold">{image.aspectRatio}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mb-4">
                  <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm">
                    {capitalize(image.category)}
                  </span>
                  <span className="bg-secondary-600 text-white px-3 py-1 rounded-full text-sm">
                    {capitalize(image.subcategory)}
                  </span>
                </div>

                <button
                  onClick={handleDownload}
                  className="w-full md:w-auto bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                >
                  Download Wallpaper
                </button>
              </div>
            </div>
          </div>
        ),
      }}
    />
  );
};

export default ImageModal;
