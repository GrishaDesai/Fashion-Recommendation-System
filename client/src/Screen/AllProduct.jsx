import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../Components/Loader";

export default function AllProduct() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/allProducts");
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error("Error details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = Math.ceil(products.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div className="container mx-auto">
      {isLoading && <Loader/> }

      <h2 className="text-3xl text-plum font-bold my-4 flex justify-center">Explore Products</h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4">
        {currentProducts.map((product, index) => (
          <div key={index} className="bg-white shadow-lg rounded-sm overflow-hidden" onClick={() => navigate(`/recommend/${product.Product_id}`)}>
            <img src={product.image_url} alt="Product" className="w-full object-fill" />
            <div className="flex items-center space-x-1 p-2">
              <span className="bg-green-100 text-green-700 text-sm font-semibold px-2 py-1 rounded">{product.Ratings} ★</span>
              <span className="text-gray-500 text-sm">({product.Reviews})</span>
            </div>
            <div className="p-2">
              <h3 className="font-semibold text-lg">{product.BrandName}</h3>
              <p className="text-gray-500 text-sm">{product.Individual_category}</p>
              <div className="mt-2 flex flex-col md:flex-row items-center md:justify-around">
                <div className="flex justify-between items-center w-3/5">
                  <span className="text-lg font-bold text-gray-900">Rs. {product.OriginalPrice}</span>
                  <span className="text-gray-400 line-through">Rs. {product.OriginalPrice}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-red-500 font-semibold">({product.DiscountOffer})</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {/* Pagination Controls */}
      {!isLoading && products.length > 0 && (
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-plum text-gray-700 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 bg-gray-100 text-gray-900 rounded">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-plum text-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

    </div>
  );
}
