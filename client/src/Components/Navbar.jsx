import React, { useState, useEffect } from "react";
import logo from '../assets/image/logo.png';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full px-4 md:px-6 flex items-center justify-between z-50 transition-all duration-300 ${scrolled ? "bg-white/10 backdrop-blur-md shadow-md" : "bg-blush"
          }`}
        style={{ height: "4rem" }}
      >
        {/* Left: Logo */}
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-12 w-auto" />
        </div>

        {/* Desktop Menu - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-10 flex-grow justify-center">
          <ul className="flex items-center gap-8 text-lg text-wine font-medium">
            {[{ "name": "Home", 'link': '/' }, { "name": "Products", 'link': '/allProducts' }, { "name": "Categories", 'link':'/category'}, {"name":"Contact", 'link':'/'}].map((item, index) => (
              <li key={index} className="relative group">
                <a
                  href={`${item.link}`}
                  className="hover:text-gray-300 transition-all duration-300"
                >
                  {item.name}
                </a>
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-ivory transition-all duration-300 group-hover:w-full"></span>
              </li>
            ))}
          </ul>

          {/* Search Bar - Shown on medium+ screens */}
          <div className="hidden lg:flex items-center justify-between border rounded-lg border-wine px-2 py-2 w-64 xl:w-80 focus-within:border-wine">
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-wine placeholder-gray-500 focus:outline-none px-2 w-full"
            />
            <button className="ml-2 text-wine hover:text-gray-600 transition-all">
              <i className="fa fa-camera" aria-hidden="true"></i>
            </button>
          </div>
        </div>

        {/* Right: Login & Signup Buttons - Hidden on mobile */}
        <div className="hidden md:flex gap-3 lg:gap-5">
          <button className="px-3 lg:px-5 py-2 border border-wine text-wine rounded-md hover:bg-wine hover:text-white transition-all text-sm lg:text-base">
            Login
          </button>
          <button className="px-3 lg:px-5 py-2 bg-wine text-white rounded-md hover:bg-opacity-80 transition-all text-sm lg:text-base">
            Signup
          </button>
        </div>

        {/* Mobile Menu Button - Only visible on mobile */}
        <button
          className="md:hidden text-wine text-2xl p-2"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? (
            <span>✕</span>
          ) : (
            <span>☰</span>
          )}
        </button>
      </nav>

      {/* Mobile Menu - Slide in from right */}
      <div
        className={`fixed top-16 right-0 h-screen w-full md:w-64 bg-blush shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex flex-col p-5">
          {/* Mobile Navigation Links */}
          <ul className="flex flex-col space-y-4 mb-6">
            {[{ "name": "Home", 'link': '/' }, { "name": "Products", 'link': '/allProducts' }, { "name": "Categories", 'link': '/category' }, { "name": "Contact", 'link': '/' }].map((item, index) => (
              <li key={index}>
                <a
                  href={`${item.link}`}
                  className="text-wine text-lg font-medium block py-2 hover:text-gray-300 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile Search */}
          <div className="flex items-center justify-between border rounded-lg border-wine px-2 py-2 w-full mb-6 focus-within:border-wine">
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-wine placeholder-gray-500 focus:outline-none px-2 w-full"
            />
            <button className="ml-2 text-wine hover:text-gray-600 transition-all">
              <i className="fa fa-camera" aria-hidden="true"></i>
            </button>
          </div>

          {/* Mobile Auth Buttons */}
          <div className="flex flex-col gap-3">
            <button className="w-full px-5 py-2 border border-wine text-wine rounded-md hover:bg-wine hover:text-white transition-all">
              Login
            </button>
            <button className="w-full px-5 py-2 bg-wine text-white rounded-md hover:bg-opacity-80 transition-all">
              Signup
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu background */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}