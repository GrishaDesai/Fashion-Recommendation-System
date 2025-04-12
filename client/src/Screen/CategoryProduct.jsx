import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Components/Navbar"; // This will be your new Navbar component
import Loader from "../Components/Loader";
import '../App.css'
import '../index.css'
import SubNavbar from "../Components/SubNavbar";

const CategoryProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const productsPerPage = 20;
  const param = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL
        setIsLoading(true);
        const response = await fetch(`${apiUrl}/category_product/${param.category}`);
        const data = await response.json();

        setProducts(data.filtered_products);
        setCategories(data.categories);
        setFilteredProducts(data.filtered_products); // Initially, show all products
        setSelectedCategory(null); // Reset category filter
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        setFilteredProducts([]);
      }
      finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [param.category]);

  // Handle category click
  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    setFilteredProducts(products.filter(product => product.Individual_category === categoryName));
    setCurrentPage(1);
  };

  // Function to reset all filters
  const resetFilters = () => {
    setFilteredProducts(products);
    setSelectedCategory(null);
    setCurrentPage(1);
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div>
      <Navbar/>
      <SubNavbar
        products={products}
        setFilteredProducts={setFilteredProducts}
        resetFilters={resetFilters}
      />
      <div className="w-full max-w-screen py-24 md:p-6 bg-gray-100 rounded-lg overflow-y-auto shadow-md scrollbar-custom max-h-screen">
        {isLoading && <Loader />}

        <div className="w-full flex gap-3 flex-nowrap overflow-x-auto scrollbar-hide mt-32 mb-5 scrollbar-custom">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`flex-shrink-0 flex flex-col items-center font-bold px-3 py-2 rounded-lg text-sm cursor-pointer transition-transform duration-300 ease-in-out ${selectedCategory === category.category ? "scale-110 text-wine" : "text-gray-800"}`}
              onClick={() => handleCategoryClick(category.category)}
            >
              <img src={category.image} alt={category.category} className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full object-fit border-2 transition-all duration-300 ease-in-out" />
              <span className="mt-2 text-center text-xs md:text-sm">{category.category}</span>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-gray-500">No products match your filters. Try different criteria or clear filters.</p>
          </div>
        ) : (
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
        )}

        {/* Pagination Controls */}
        {filteredProducts.length > 0 && (
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
      </div>
    </div>
  );
};

export default CategoryProducts;