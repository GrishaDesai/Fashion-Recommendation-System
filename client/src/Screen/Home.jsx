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


export default function Home() {

  const models = [model1, model2, model3];
  const [cat, setCat] = useState([]);
  const styles = [
    [style11, style12, style13, style14],
    [style21, style22, style23, style24],
    [style34, style31, style33, style32]
  ];

  const [currentModel, setCurrentModel] = useState(0);
  const [bottomImages, setBottomImages] = useState(styles[0]);
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

  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchCategory = async () => {
    try {
      const response = await fetch("https://tiyara.onrender.com/main_category");
      const data = await response.json();
      console.log(data);

      setCat(data);
    } catch (err) {
      console.error("Error details:", err);
    } finally {
    }
  };

  return (
    <div className="overflow-y-auto scrollbar-custom h-screen">
      {/* Navbar */}
      <Navbar />
      <div className="relative bg-blush">
        {/* Main content including model image */}
        <div className="mt-16 w-full flex justify-between">
          <div className="w-[50%] px-20 pt-20">
            <h1 className="text-7xl font-extrabold text-plum mb-5">Tiyara - </h1>
            <h1 className="text-5xl font-bold text-plum opacity-80 mb-10" style={{ 'lineHeight': '55px' }}>Crowning Your Style with Elegance and Glamour. </h1>
            <button className="bg-plum rounded-md px-5 py-3 text-ivory font-medium">Start Shopping</button>
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
        <div className="flex justify-evenly">
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
    </div>
  );

}
