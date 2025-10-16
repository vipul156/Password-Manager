"use client";
import React, { useState } from "react";
import { IoShieldOutline } from "react-icons/io5";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import Link from "next/link";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = ["Features", "Pricing", "Security", "Support", "Blog"];
  const menu =
    "flex items-center justify-center cursor-pointer hover:text-[#1D9C76] transition-colors duration-200";
  const buttonBase =
    "rounded-[5px] p-2 font-medium transition-all duration-200 cursor-pointer";

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-md relative z-50">
      {/* Left side */}
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-1">
          <IoShieldOutline size={28} className="text-[#1D9C76]" />
          <span className="font-semibold text-lg">PassOp</span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 items-center">
          {navItems.map((item) => (
            <Link key={item} href={`/${item.toLowerCase()}`}>
              <li className={menu}>{item}</li>
            </Link>
          ))}
        </ul>
      </div>

      {/* Right side (Desktop Buttons) */}
      <ul className="hidden md:flex gap-6 items-center">
        <Link href="/login">
          <li
            className={`${buttonBase} bg-[#F2F3F5] hover:bg-[#E5E6E8] text-gray-700`}
          >
            Login
          </li>
        </Link>
        <li
          className={`${buttonBase} bg-[#1D9C76] hover:bg-[#178F68] text-white`}
        >
          Get Started – Free Trial
        </li>
      </ul>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-3xl text-gray-700"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <HiX /> : <HiMenuAlt3 />}
      </button>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="absolute top-0 right-0 w-2/3 h-screen bg-white shadow-lg p-6 flex flex-col gap-6 md:hidden animate-slide-in">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-xl">Menu</span>
            <HiX
              size={28}
              className="cursor-pointer"
              onClick={() => setMenuOpen(false)}
            />
          </div>
          <ul className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link key={item} href={`/${item.toLowerCase()}`}>
                <li
                  onClick={() => setMenuOpen(false)}
                  className="py-2 border-b border-gray-200 hover:text-[#1D9C76] transition-colors"
                >
                  {item}
                </li>
              </Link>
            ))}
          </ul>
          <div className="flex flex-col gap-4 mt-4">
            <Link href="/login">
              <button
                onClick={() => setMenuOpen(false)}
                className="w-full bg-[#F2F3F5] hover:bg-[#E5E6E8] text-gray-700 p-2 rounded"
              >
                Login
              </button>
            </Link>
            <button
              onClick={() => setMenuOpen(false)}
              className="w-full bg-[#1D9C76] hover:bg-[#178F68] text-white p-2 rounded"
            >
              Get Started – Free Trial
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
