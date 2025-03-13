import React, { useState, useEffect } from "react";
import flower from '../assets/svg/flower2.svg'
import model1 from "../assets/image/model1.png";
import model2 from "../assets/image/model3.png";
import model3 from "../assets/image/model31.png";
import style11 from "../assets/image/style11.webp";
import style12 from "../assets/image/style12.webp";
import style13 from "../assets/image/style13.webp";
import style14 from "../assets/image/style14.jpeg";
import style21 from "../assets/image/style21.avif";
import style22 from "../assets/image/style22.jpg";
import style23 from "../assets/image/style23.jpg";
import style24 from "../assets/image/style24.jpg";
import style31 from "../assets/image/style31.jpg";
import style32 from "../assets/image/style32.jpg";
import style33 from "../assets/image/style33.jpg";
import style34 from "../assets/image/style34.jpg";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";
import Loader from "../Components/Loader";


export default function Home() {

  const models = [model1, model2, model3];
  const [isMobile, setIsMobile] = useState(false);
  const [cat, setCat] = useState([]);
  const styles = [
    [style11, style12, style13, style14],
    [style21, style22, style23, style24],
    [style34, style31, style33, style32]
  ];

  const [currentModel, setCurrentModel] = useState(0);
  const [bottomImages, setBottomImages] = useState(styles[0]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [fade, setFade] = useState(false);

  // Different animation effects
  const animations = [
    "translate-x-[-100%] opacity-0 ",  // Slide Left
    "translate-y-[100%] opacity-0 ",  // Slide Up
    "translate-x-[100%] opacity-0 ",   // Slide Right
    "scale-50 opacity-0",             // Zoom In
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setCurrentModel((prev) => (prev + 1) % models.length);
        setBottomImages(styles[(currentModel + 1) % models.length]);
        setFade(false);
      }, 2000); // Sync animation timing
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);

  }, [currentModel]);

  // Function to check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md = 768px in Tailwind
    };

    checkScreenSize(); // Check once on mount
    window.addEventListener("resize", checkScreenSize); // Listen for screen resizing

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchCategory = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/main_category");
      const data = await response.json();
      console.log(data);

      setCat(data);
    } catch (err) {
      console.error("Error details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="overflow-y-auto scrollbar-custom h-screen">
      {isLoading && <Loader />}
      {/* Navbar */}
      <Navbar />
      {isMobile ? (
        // 🌟 Render for Mobile (sm)
        <>
          <div className="relative bg-blush px-6 py-10">
            {/* Content container */}
            <div className="flex flex-col-reverse md:flex-row justify-between items-center">
              {/* Left side - Text */}
              <div className="w-full md:w-1/2 text-center md:text-left">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-plum mb-4">
                  Tiyara -
                </h1>
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-plum opacity-80 leading-tight mb-6">
                  Crowning Your Style with Elegance and Glamour.
                </h2>
                <button className="bg-plum rounded-md px-5 py-3 text-ivory font-medium text-lg" onClick={() => navigate('/allProducts')}>
                  Start Shopping
                </button>
              </div>

              {/* Right side - Model & Animation */}
              <div className="w-full md:w-1/2 flex justify-center relative mt-6 md:mt-0">
                <div className="relative w-60 h-72 sm:w-80 sm:h-96 lg:w-[400px] lg:h-[500px] overflow-hidden">
                  {/* Background Flower Image */}
                  <img
                    src={flower}
                    alt="flower"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                  />

                  {/* Animated Model Image */}
                  <img
                    src={models[currentModel]}
                    alt="model"
                    className={`absolute inset-0 w-full h-full object-contain transition-all duration-[3000ms] ${fade ? "opacity-0 scale-50" : "opacity-100 scale-100"
                      }`}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Images for Style */}
            <div className="mt-10 flex justify-center gap-4">
              {bottomImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`style - ${index}`}
                  className={`w-20 h-20 sm:w-28 sm:h-28 lg:w-36 lg:h-36 object-cover rounded-lg shadow-lg transition-all duration-1000 ${fade ? "opacity-0 translate-y-6" : "opacity-100 translate-y-0"
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Category Section */}
          <div className="mt-5 px-6">
            <div className="flex overflow-x-auto gap-6 justify-center scrollbar-custom">
              {cat.map((category, index) => (
                <div key={index} className="flex flex-col items-center">
                  {/* Category Container */}
                  <div
                    className="relative w-32 h-36 sm:w-44 sm:h-48 flex flex-col items-center cursor-pointer"
                    onClick={() => navigate(`/category/${category.m_cat}`)}
                  >
                    {/* Category Image */}
                    <img
                      src={`${category.image}`}
                      alt={category.name}
                      className="w-24 h-32 sm:w-28 sm:h-44 object-cover absolute rounded-b-full bottom-0 z-10"
                    />
                    {/* Circular Background */}
                    <div className="w-28 h-28 sm:w-40 sm:h-40 bg-blush rounded-full shadow-lg absolute bottom-0"></div>
                  </div>
                  {/* Category Name */}
                  <h3 className="mt-3 text-base sm:text-lg font-semibold text-plum">
                    {category.m_cat}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        // 💻 Render for Desktop (md and larger)
        <>
          <div className="relative bg-blush">
            {/* Main content including model image */}
            <div className="mt-16 w-full flex justify-between">
              <div className="w-[50%] px-20 pt-20">
                <h1 className="text-7xl font-extrabold text-plum mb-5">Tiyara - </h1>
                <h1 className="text-5xl font-bold text-plum opacity-80 mb-10" style={{ 'lineHeight': '55px' }}>Crowning Your Style with Elegance and Glamour. </h1>
                <button className="bg-plum rounded-md px-5 py-3 text-ivory font-medium" onClick={() => navigate('/allProducts')}>Start Shopping</button>
              </div>
              <div className="w-[50%] px-4 text-center relative">
                <div className="relative flex items-center justify-center">
                  {/* Background Flower Image */}
                  <img
                    src={flower}
                    alt="flower"
                    className="absolute top-0 left-0 w-full h-full object-cover opacity-60"
                  />

                  {/* Changing Model Images with Animation */}
                  <div className="relative w-[400px] h-[500px] overflow-hidden">
                    <img
                      src={models[currentModel]}
                      alt="model"
                      className={`absolute top-0 left-0 w-full h-full object-contain transition-all duration-[3000ms] ${fade ? animations[currentModel % animations.length] : "translate-x-0 translate-y-0 scale-100 opacity-100"}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SVG Wave */}
            <div className="absolute bottom-0 w-full leading-none">
              <svg
                viewBox="0 0 1200 120"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                className="w-full h-24"
              >
                <path d="M0,100 C400,200 800,0 1200,100 V120 H0 Z" fill="white"></path>
              </svg>

              {/* 4 Images positioned to overlap both model and wave */}
              <div className="absolute bottom-[-80px] p-5 right-[5%] transform flex gap-6 z-10">
                {bottomImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`bottom-style-${index}`}
                    className={`w-[150px] h-[150px] object-cover rounded-lg shadow-lg transition-all duration-1000 ${fade ? "opacity-0 translate-y-6" : "opacity-100 translate-y-0"}`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="mt-40">
            <div className="flex flex-nowrap overflow-x-auto justify-evenly scrollbar-custom">
              {cat.map((category, index) => (
                <div key={index} className="flex flex-col items-center">
                  {/* Container for both circle and image */}
                  <div className="relative w-44 h-48 flex flex-col items-center" onClick={() => navigate(`/category/${category.m_cat}`)}>
                    {/* Image that extends above the circle */}
                    <img
                      src={`../${category.image}`}
                      alt={category.name}
                      className="w-28 h-44 object-cover absolute rounded-b-full bottom-0"
                      style={{
                        zIndex: "10" // Keep image above the circle
                      }}
                    />

                    {/* Circular mask that hides bottom part */}
                    <div className="w-40 h-40 bg-blush rounded-full shadow-lg absolute bottom-0">
                      {/* Empty div that acts as the circle */}
                    </div>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-plum">{category.m_cat}</h3>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

}
