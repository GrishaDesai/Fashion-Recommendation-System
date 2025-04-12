import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../Components/Loader";
import Navbar from "../Components/Navbar";
import SubNavbar from "../Components/SubNavbar";

export default function AllProduct() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
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
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${apiUrl}/allProducts`);
      const data = await response.json();
      console.log(data);
      setProducts(data);
      setFilteredProducts(data); // Initialize filtered products with all products
    } catch (err) {
      console.error("Error details:", err);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset filters function
  const resetFilters = () => {
    setFilteredProducts(products);
    setCurrentPage(1);
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="w-full max-w-screen mx-auto bg-rose min-h-screen pb-5">
      {isLoading && <Loader />}

      <Navbar />
      <SubNavbar
        products={products}
        setFilteredProducts={setFilteredProducts}
        resetFilters={resetFilters}
      />

      <div className="flex justify-center">
        <h2 className="text-3xl font-bold mb-6 text-plum border-b-2 border-lavender w-1/3 py-2 text-center mt-32">
          Explore Products
        </h2>
      </div>

      {filteredProducts.length === 0 && !isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl text-gray">
            No products match your filters. Try different criteria or clear filters.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4">
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
          {!isLoading && filteredProducts.length > 0 && totalPages > 1 && (
            <div className="flex justify-center items-center mt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 mx-2 border rounded ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-plum text-white"}`}
              >
                Previous
              </button>
              <span className="text-lg font-semibold mx-4">
                Page {currentPage} of {totalPages || 1}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`px-4 py-2 mx-2 border rounded ${currentPage === totalPages || totalPages === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-plum text-white"}`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}