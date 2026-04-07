// src/components/images/ImageGrid.jsx
import React from "react";
import Masonry from "react-masonry-css";
import ImageCard from "./ImageCard";
import { MASONRY_BREAKPOINTS } from "../../utils/constants";
import "./ImageGrid.css";

const ImageGrid = ({ images, onImageClick }) => {
  if (!images || images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No images found</p>
      </div>
    );
  }

  return (
    <Masonry
      breakpointCols={MASONRY_BREAKPOINTS}
      className="masonry-grid"
      columnClassName="masonry-grid-column"
    >
      {images.map((image) => (
        <ImageCard key={image._id} image={image} onClick={onImageClick} />
      ))}
    </Masonry>
  );
};

export default ImageGrid;
