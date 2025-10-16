"use client";
import React from "react";

function Footer() {
  const links = ["Company", "Product", "Security", "Resources"];

  return (
    <footer className="w-full bg-white border-t border-gray-200 shadow-md z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Footer Links */}
        <ul className="flex flex-wrap justify-center md:justify-start gap-4 sm:gap-6 text-sm sm:text-base text-gray-700">
          {links.map((link) => (
            <li
              key={link}
              className="cursor-pointer hover:text-[#1D9C76] transition-colors duration-200"
            >
              {link}
            </li>
          ))}
        </ul>

        {/* Copyright */}
        <p className="text-xs sm:text-sm text-gray-500 text-center md:text-right mt-2 md:mt-0">
          © {new Date().getFullYear()} PassOp. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
