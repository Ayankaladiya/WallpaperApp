import React from "react";
import { AiOutlineHeart } from "react-icons/ai";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-gray-300">Made with</span>
            <AiOutlineHeart className="text-red-500 animate-pulse" />
            <span className="text-gray-300">for wallpaper lovers</span>
          </div>
          <p className="text-gray-400 text-sm">
            © {currentYear} Wallpaper Website. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs">
            College Project - Built with React & Node.js
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
