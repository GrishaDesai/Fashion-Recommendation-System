import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import SubNavbar from '../Components/SubNavbar';

export default function Price() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const productsPerPage = 20;
    const navigate = useNavigate();
    const param = useParams();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await fetch(`${apiUrl}/prices/${param.price}`);
            const data = await response.json();
            setProducts(data);
        } catch (err) {
            console.error("Error details:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Get unique categories
    const categories = ['All', ...new Set(products.map(product => product.Individual_category))];

    // Filter products based on selected category
    const filteredProducts = selectedCategory === 'All'
        ? products
        : products.filter(product => product.Individual_category === selectedCategory);

    // Pagination calculations
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Reset to page 1 when category changes
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory]);

    return (
        <>
        <div>
            <Navbar/>
        </div>
        <div>
            <SubNavbar/> 
        </div>
        <div className="w-full max-w-screen mx-auto px-4 py-8 bg-rose min-h-screen mt-28">

            {/* Category Filters */}
            <div className="mb-6 flex flex-wrap gap-2 justify-center">
                {categories.map((category, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                            ${selectedCategory === category
                                ? 'bg-plum text-white'
                                : 'bg-white text-plum border border-plum hover:bg-plum hover:text-white'}`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <p className="text-xl text-wine animate-pulse">Loading...</p>
                </div>
            ) : (
                <>
                    {filteredProducts.length === 0 ? (
                        <div className="flex justify-center items-center h-64">
                            <p className="text-xl text-gray">
                                No products available{selectedCategory !== 'All' ? ` in ${selectedCategory} category` : ''}.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {currentProducts.map((product, index) => (
                                    <div
                                        key={index}
                                        className="bg-white shadow-lg rounded-sm overflow-hidden"
                                        onClick={() => navigate(`/recommend/${product.Product_id}`)}
                                    >
                                        <img src={product.image_url} alt="Product" className="w-full object-fill" />
                                        <div className="flex items-center space-x-1 p-2">
                                            <span className="bg-green-100 text-green-700 text-sm font-semibold px-2 py-1 rounded">
                                                {product.Ratings} ★
                                            </span>
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

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center mt-6">
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className={`px-4 py-2 mx-2 border rounded 
                                            ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-plum text-white"}`}
                                    >
                                        Previous
                                    </button>
                                    <span className="text-lg font-semibold mx-4">
                                        Page {currentPage} of {totalPages || 1}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages || totalPages === 0}
                                        className={`px-4 py-2 mx-2 border rounded 
                                            ${currentPage === totalPages || totalPages === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-plum text-white"}`}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
        </>
    )
}