import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const param = useParams();


  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://tiyara.onrender.com/allCategories/${param.category}`);
      const data = await response.json();
      console.log("data ", data);

      setProducts(data);
    } catch (err) {
      console.error("Error details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">All Products</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                {[
                  "URL",
                  "Product ID",
                  "Category",
                  "Image",
                  "Brand Name",
                  "Individual Category",
                  "Description",
                  "Discount Price",
                  "Original Price",
                  "Discount Offer",
                  "Size Option",
                  "Ratings",
                  "Reviews",
                ].map((header) => (
                  <th key={header} className="border border-gray-300 px-4 py-2">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index} className="">
                  <td className="border border-gray-300 px-4 py-2">
                    <a
                      href={product.URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Link
                    </a>
                  </td>
                  <td className="border border-gray-300 px-4 py-2" onClick={() => navigate(`/recommend/${product.Product_id}`)}>{product.Product_id}</td>
                  <td className="border border-gray-300 px-4 py-2">{product.Category}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {product.image_url ? (
                      <img src={product.image_url} alt="Product" className="h-16 w-16 object-cover" />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{product.BrandName}</td>
                  <td className="border border-gray-300 px-4 py-2">{product.Individual_category}</td>
                  <td className="border border-gray-300 px-4 py-2">{product.Description}</td>
                  <td className="border border-gray-300 px-4 py-2">{product.DiscountPrice}</td>
                  <td className="border border-gray-300 px-4 py-2">{product.OriginalPrice}</td>
                  <td className="border border-gray-300 px-4 py-2">{product.DiscountOffer}</td>
                  <td className="border border-gray-300 px-4 py-2">{product.SizeOption}</td>
                  <td className="border border-gray-300 px-4 py-2">{product.Ratings}</td>
                  <td className="border border-gray-300 px-4 py-2">{product.Reviews}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
