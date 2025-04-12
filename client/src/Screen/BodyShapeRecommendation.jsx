import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function BodyShapeRecommendation() {
  const location = useLocation();
  const navigate = useNavigate();

  const { recommendedProducts = [] } = location.state || {};
  const { bodyShape = '' } = location.state || {};
  const { bodyShapeData = {} } = location.state || {};

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = recommendedProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(recommendedProducts.length / itemsPerPage);

  return (
    <div className='bg-blush'>
      <h1 className='text-center text-3xl font-bold text-plum mb-3 py-3'>
        {bodyShape} Body Shape
      </h1>

      {/* Scrollable Recommendations */}
      <div className='flex overflow-x-auto space-x-4 py-3 px-4 scrollbar-hide justify-evenly'>
        {bodyShapeData.Recommendations?.map((item) => (
          <div key={item.name} className='flex flex-col justify-center items-center min-w-[100px] md:min-w-[150px]'>
            <img
              src={item.image}
              alt={item.category}
              className='w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full object-fit border-2 transition-all duration-300 ease-in-out'
            />
            <span className='mt-2 text-center text-s md:text-sm text-wine'>{item.name}</span>
          </div>
        ))}
      </div>

      {/* Product Grid */}
      <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4'>
        {currentProducts.map((product, index) => (
          <div
            key={index}
            className='bg-white shadow-lg rounded-sm overflow-hidden'
            onClick={() => navigate(`/recommend/${product.Product_id}`)}
          >
            <img src={product.image_url} alt='Product' className='w-full object-fill' />
            <div className='flex items-center space-x-1 p-2'>
              <span className='bg-green-100 text-green-700 text-sm font-semibold px-2 py-1 rounded'>
                {product.Ratings} ★
              </span>
              <span className='text-gray-500 text-sm'>({product.Reviews})</span>
            </div>
            <div className='p-2'>
              <h3 className='font-semibold text-lg'>{product.BrandName}</h3>
              <p className='text-gray-500 text-sm'>{product.Individual_category}</p>
              <div className='mt-2 flex flex-col md:flex-row items-center md:justify-around'>
                <div className='flex justify-between items-center w-3/5'>
                  <span className='text-lg font-bold text-gray-900'>Rs. {product.OriginalPrice}</span>
                  <span className='text-gray-400 line-through'>Rs. {product.OriginalPrice}</span>
                </div>
                <div className='flex items-center'>
                  <span className='text-red-500 font-semibold'>({product.DiscountOffer})</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className='flex justify-center items-center py-6'>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 mx-2 border rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-plum text-white'}`}
          >
            Previous
          </button>
          <span className='text-lg font-semibold mx-4'>
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`px-4 py-2 mx-2 border rounded ${currentPage === totalPages || totalPages === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-plum text-white'}`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
