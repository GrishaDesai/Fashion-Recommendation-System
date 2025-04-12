import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import Navbar from '../Components/Navbar';
import Loader from '../Components/Loader';

export default function Recommendation() {
    const [productId, setProductId] = useState("");
    const [product, setProduct] = useState({});
    const [recommendations, setRecommendations] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [debugInfo, setDebugInfo] = useState(null);
    const param = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (param.id) {
            setProductId(param.id);
            fetchRecommendations(param.id);
            // fetchProduct();
        }
    }, [param.id]);

    const fetchRecommendations = async (id) => {
        try {
            setIsLoading(true);
            setError("");
            setDebugInfo(null);
            const apiUrl = process.env.REACT_APP_API_URL
            const response = await fetch(`${apiUrl}/recommend/${id}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch recommendations");
            }

            if (!data.recommendations || !Array.isArray(data.recommendations)) {
                throw new Error("Invalid recommendations data received");
            }

            setRecommendations(data.recommendations);
            setProduct(data.product);
            console.log("data recommendations - ", data.recommendations);
            console.log("data product - ", data.product);

            // If there's any debug info in the response, save it
            if (data.details || data.available_sample) {
                setDebugInfo({
                    details: data.details,
                    availableSample: data.available_sample
                });
            }
        } catch (err) {
            console.error("Error details:", err);
            setError(err.message);
            setRecommendations([]);
        } finally {
            setIsLoading(false);
        }
    };

    // const fetchProduct = async () => {
    //     try {
    //         const response = await fetch(`http://localhost:5000/product/${param.id}`);
    //         if (!response.ok) {
    //             throw new Error("Failed to fetch product");
    //         }
    //         const data = await response.json();
    //         console.log(response);
    //         console.log("data - ", data.product);
    //         console.log('hello');


    //         setProduct(data.product);
    //     } catch (err) {
    //         setError(err.message);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    return (
        <div className="scrollbar-custom max-h-screen overflow-auto">
            <h1 className="text-xl font-bold mb-2">Clothing Recommendation System</h1>

            {isLoading && <Loader />}

            <Navbar />
            <div className="w-full max-w-screen min-h-screen">

                <div className="w-full bg-white p-8 rounded-xl shadow-lg flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
                    {/* Product Image */}
                    <div className="w-full md:w-1/2">
                        <img
                            src={product.image_url}
                            alt={product.Description}
                            className="w-full h-auto object-cover rounded-lg shadow-md hover:opacity-95 transition-opacity"
                        />
                    </div>

                    {/* Product Details */}
                    <div className="w-full md:w-1/2 flex flex-col gap-5 justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-plum mb-2">{product.BrandName}</h1>
                            <p className="text-wine font-semibold mt-2 text-lg capitalize">{product.Description}</p>
                            <p className="text-rose font-semibold mt-2 text-lg mb-4">{product.Category} - {product.Individual_category}</p>

                            {/* Ratings and Reviews */}
                            <div className="flex items-center space-x-3 my-5">
                                <span className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                    </svg>
                                    {product.Ratings}
                                </span>
                                <span className="text-wine text-sm">{product.Reviews} Reviews</span>
                            </div>

                            {/* Pricing */}
                            <div className="mt-4 flex items-center">
                                <span className="text-2xl font-bold text-plum">₹{product.OriginalPrice}</span>
                                {product.DiscountOffer && (
                                    <span className="text-red-500 font-semibold ml-3 text-lg">
                                        {product.DiscountOffer}
                                    </span>
                                )}
                            </div>

                            {/* Size Selection */}
                            <div className="mt-7">
                                <h3 className="text-plum font-bold uppercase tracking-wider text-md mb-4">Select Size</h3>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {product.SizeOption?.split(',').map((size, index) => (
                                        <span
                                            key={index}
                                            className="border-2 border-wine text-wine px-5 py-2 rounded-full cursor-pointer hover:border-gray-800 hover:bg-gray-50 transition-colors text-center min-w-12"
                                        >
                                            {size.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                            <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold flex-1 transition-colors flex items-center justify-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                                </svg>
                                ADD TO BAG
                            </button>
                            <button className="border-2 border-wine text-wine hover:border-gray-800 px-6 py-3 rounded-lg font-semibold flex-1 transition-colors flex items-center justify-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                </svg>
                                WISHLIST
                            </button>
                        </div>

                        {/* Product Link */}
                        <div className="mt-6 text-sm text-gray-500">
                            <a href={product.URL} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center transition-colors">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                </svg>
                                View on Myntra
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-screen grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4 mt-4">
                {
                    recommendations.map((item, index) => (
                        <div className="bg-white shadow-lg rounded-sm overflow-hidden" onClick={() => navigate(`/recommend/${item.recommended_product.Product_id}`)}>
                            {/* Product Image */}
                            <img
                                src={item.recommended_product.image_url}
                                alt="Sangria Unstitched Dress Material"
                                className="w-full object-cover"
                            />

                            {/* Rating Section */}
                            <div className="flex items-center space-x-1 p-2">
                                <span className="bg-green-100 text-green-700 text-sm font-semibold px-2 py-1 rounded">
                                    {item.recommended_product.Ratings} ★
                                </span>
                                <span className="text-gray-500 text-sm">({item.recommended_product.Reviews})</span>
                            </div>

                            {/* Product Info */}
                            <div className="p-4">
                                <h3 className="font-semibold text-lg">{item.recommended_product.BrandName}</h3>
                                <p className="text-gray-500 text-sm">{item.recommended_product.Individual_category}</p>

                                {/* Price Section */}
                                <div className="mt-2 flex items-center space-x-2">
                                    <span className="text-lg font-bold text-gray-900">Rs. {item.recommended_product.OriginalPrice}</span>
                                    <span className="text-gray-400 line-through">Rs. {item.recommended_product.OriginalPrice}</span>
                                    <span className="text-red-500 font-semibold">({item.recommended_product.DiscountOffer})</span>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}