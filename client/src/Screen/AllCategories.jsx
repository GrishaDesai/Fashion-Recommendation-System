import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
      console.log(data);

      setCat(data);
    } catch (err) {
      console.error("Error details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          {cat.map((item, index) => (

            <div className="border border-gray-300 px-4 py-2" onClick={() => navigate(`/category/${item.unique_categories}`)}>{item.unique_categories}</div>

          ))}
        </div>
      )}
    </div>
  )
}
