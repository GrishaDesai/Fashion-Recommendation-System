import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CategoryProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const productsPerPage = 20;
  const param = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`https://tiyara.onrender.com/category_product/${param.category}`);
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
    };

    fetchProducts();
  }, [param.category]);

  // Handle category click
  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    setFilteredProducts(products.filter(product => product.Individual_category === categoryName));
    setCurrentPage(1);
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div className="w-full p-6 bg-gray-100 rounded-lg shadow-md">
      {/* <h2 className="text-xl font-bold mb-4">{categories[0].category}</h2> */}
      <div className="flex gap-3 flex-nowrap overflow-x-auto scrollbar-hide mb-10 scrollbar-custom">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`flex-shrink-0 flex flex-col items-center text-plum font-bold px-3 py-2 rounded-lg text-sm cursor-pointer `}
            onClick={() => handleCategoryClick(category.category)}
          >
            <img src={category.image} alt={category.category} className={`w-40 h-40 rounded-full object-fill ${selectedCategory === category.category ? "border-wine border-[8px] scale-110 text-white" : ""}`} />
            <span className="mt-2 text-center">{category.category}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 justify-center items-center place-items-center">
        {currentProducts.map((product, index) => (
          <div key={index} className="w-64 bg-white shadow-lg rounded-sm overflow-hidden" onClick={() => navigate(`/recommend/${product.Product_id}`)}>
            <img src={product.image_url} alt="Product" className="w-full h-80 object-fill" />
            <div className="flex items-center space-x-1 p-2">
              <span className="bg-green-100 text-green-700 text-sm font-semibold px-2 py-1 rounded">{product.Ratings} ★</span>
              <span className="text-gray-500 text-sm">({product.Reviews})</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg">{product.BrandName}</h3>
              <p className="text-gray-500 text-sm">{product.Individual_category}</p>
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-lg font-bold text-gray-900">Rs. {product.OriginalPrice}</span>
                <span className="text-gray-400 line-through">Rs. {product.OriginalPrice}</span>
                <span className="text-red-500 font-semibold">({product.DiscountOffer})</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 mx-2 border rounded ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-plum text-white"}`}
        >
          Previous
        </button>
        <span className="text-lg font-semibold mx-4">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 mx-2 border rounded ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-plum text-white"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CategoryProducts;
