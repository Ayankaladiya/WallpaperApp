import React from "react";
import { AiOutlineWarning } from "react-icons/ai";

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md w-full">
        <div className="flex items-center justify-center mb-4">
          <AiOutlineWarning className="text-red-500 text-5xl" />
        </div>
        <h3 className="text-lg font-semibold text-red-800 text-center mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-red-600 text-center mb-4">
          {message || "Unable to load data. Please try again."}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
