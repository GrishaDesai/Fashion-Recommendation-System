import React, { useState, useEffect } from "react";
import logo from '../assets/image/logo.png';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
  className={`fixed bg-blush top-0 left-0 w-full h-16 px-6 flex items-center justify-between z-50 transition-all duration-300 ${
    scrolled ? "bg-white/10 backdrop-blur-md shadow-md" : "bg-blush"
  }`}
>
  {/* Left: Logo */}
  <div className="flex items-center gap-10">
    <img src={logo} alt="Logo" className="h-14 w-auto" />
    <ul className="flex items-center gap-8 text-lg text-wine font-medium">
      {["Home", "About", "Services", "Contact"].map((item, index) => (
        <li key={index} className="relative group">
          <a
            href={`#${item.toLowerCase()}`}
            className="hover:text-gray-300 transition-all duration-300"
          >
            {item}
          </a>
          <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-ivory transition-all duration-300 group-hover:w-full"></span>
        </li>
      ))}
    </ul>
  </div>

  {/* Center: Navbar Links + Search Bar */}
  <div className="flex items-center">

    {/* Search Bar */}
    <div className="flex items-center justify-between border rounded-lg border-wine px-2 py-2 w-80 focus-within:border-wine">
      <input
        type="text"
        placeholder="Search..."
        className="bg-transparent text-wine placeholder-gray-500 focus:outline-none px-2"
      />
      <button className="ml-2 text-wine hover:text-gray-600 transition-all">
        <i className="fa fa-camera" aria-hidden="true"></i>
      </button>
    </div>
  </div>

  {/* Right: Login & Signup Buttons */}
  <div className="flex gap-5">
    <button className="px-5 py-2 border border-wine text-wine rounded-md hover:bg-wine hover:text-white transition-all">
      Login
    </button>
    <button className="px-5 py-2 bg-wine text-white rounded-md hover:bg-opacity-80 transition-all">
      Signup
    </button>
  </div>
</nav>
    
  );
}
