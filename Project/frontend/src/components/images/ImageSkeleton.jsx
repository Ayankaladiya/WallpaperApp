// src/components/images/ImageSkeleton.jsx
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ImageSkeleton = ({ count = 12 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array(count)
        .fill()
        .map((_, idx) => (
          <div key={idx} className="rounded-lg overflow-hidden">
            <Skeleton height={300} />
          </div>
        ))}
    </div>
  );
};

export default ImageSkeleton;
