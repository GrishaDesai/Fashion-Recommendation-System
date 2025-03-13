import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

export default function AllCategories() {
  const [cat, setCat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchCategory = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("https://tiyara.onrender.com/allCategories");
      const data = await response.json();
      setCat(data);
    } catch (err) {
      console.error("Error details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Navbar />
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 mt-12 flex justify-center">Categories</h2>

      {isLoading ? (
        <p className="text-center text-lg text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cat.map((item, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg overflow-hidden shadow-md cursor-pointer hover:scale-105 transition-transform"
              onClick={() => navigate(`/cat_product/${item.category}`)}
            >
              <img
                src={item.image}
                alt={item.category}
                className="w-full h-auto object-cover"
              />
              <div className="p-4 text-center bg-white">
                <h3 className="text-lg font-semibold text-gray-800">{item.category}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
