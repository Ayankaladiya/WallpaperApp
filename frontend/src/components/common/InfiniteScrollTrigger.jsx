// src/components/common/InfiniteScrollTrigger.jsx
import React, { useEffect, useRef } from "react";
import LoadingSpinner from "./LoadingSpinner";

const InfiniteScrollTrigger = ({ onIntersect, hasMore, isFetching }) => {
  const observerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          onIntersect();
        }
      },
      { threshold: 0.1 },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [onIntersect, hasMore, isFetching]);

  if (!hasMore) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">You've reached the end! 🎉</p>
      </div>
    );
  }

  return (
    <div ref={observerRef} className="py-8">
      {isFetching && <LoadingSpinner size="md" message="Loading more..." />}
    </div>
  );
};

export default InfiniteScrollTrigger;
