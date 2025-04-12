import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, SlidersHorizontal, ChevronDown } from 'lucide-react';

const SubNavbar = ({ products, setFilteredProducts, resetFilters }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [ratingFilter, setRatingFilter] = useState('');
    const [discountFilter, setDiscountFilter] = useState('');
    const [availableBrands, setAvailableBrands] = useState([]);
    const navigate = useNavigate();

    // Extract available brands from products
    useEffect(() => {
        if (products && products.length > 0) {
            const brands = [...new Set(products.map(product => product.BrandName))];
            setAvailableBrands(brands);
        }
    }, [products]);

    // Search functionality
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (!value.trim()) {
            // If search is empty, just apply other filters
            applyAllFilters('', priceRange, selectedBrands, ratingFilter, discountFilter);
        } else {
            applyAllFilters(value, priceRange, selectedBrands, ratingFilter, discountFilter);
        }
    };

    // Price range filter
    const handlePriceChange = (e, type) => {
        const value = e.target.value;
        setPriceRange(prev => ({
            ...prev,
            [type]: value
        }));
    };

    // Brand filter
    const toggleBrandSelection = (brand) => {
        setSelectedBrands(prev => {
            if (prev.includes(brand)) {
                return prev.filter(b => b !== brand);
            } else {
                return [...prev, brand];
            }
        });
    };

    // Rating filter
    const handleRatingChange = (e) => {
        setRatingFilter(e.target.value);
    };

    // Discount filter
    const handleDiscountChange = (e) => {
        setDiscountFilter(e.target.value);
    };

    // Apply all filters
    const applyAllFilters = (search, price, brands, rating, discount) => {
        if (!products) return;

        let filtered = [...products];

        // Apply search filter
        if (search.trim()) {
            const searchLower = search.toLowerCase();
            filtered = filtered.filter(product =>
                product.BrandName.toLowerCase().includes(searchLower) ||
                product.Individual_category.toLowerCase().includes(searchLower) ||
                // Include search on tags if available
                (product.tags && typeof product.tags === 'string' &&
                    product.tags.toLowerCase().includes(searchLower))
            );
        }

        // Apply price filter
        if (price.min) {
            filtered = filtered.filter(product => Number(product.OriginalPrice) >= Number(price.min));
        }
        if (price.max) {
            filtered = filtered.filter(product => Number(product.OriginalPrice) <= Number(price.max));
        }

        // Apply brand filter
        if (brands.length > 0) {
            filtered = filtered.filter(product => brands.includes(product.BrandName));
        }

        // Apply rating filter
        if (rating) {
            filtered = filtered.filter(product => Number(product.Ratings) >= Number(rating));
        }

        // Apply discount filter
        if (discount) {
            filtered = filtered.filter(product => {
                // Extract number from discount string (e.g., "30% OFF" -> 30)
                const discountPercentage = parseInt(product.DiscountOffer.match(/\d+/)?.[0] || '0');
                return discountPercentage >= Number(discount);
            });
        }

        setFilteredProducts(filtered);
    };

    // Apply all filters when any filter changes
    useEffect(() => {
        applyAllFilters(searchTerm, priceRange, selectedBrands, ratingFilter, discountFilter);
    }, [priceRange, selectedBrands, ratingFilter, discountFilter]);

    // Clear all filters
    const handleClearFilters = () => {
        setSearchTerm('');
        setPriceRange({ min: '', max: '' });
        setSelectedBrands([]);
        setRatingFilter('');
        setDiscountFilter('');
        resetFilters();
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-wine shadow-md mt-16">
            <div className="container mx-auto px-4 py-3">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    {/* Logo */}
                    <div
                        className="text-2xl font-bold text-blush hover:text-wine transition-colors duration-300 cursor-pointer mb-2 md:mb-0"
                        onClick={() => navigate('/')}
                    >
                        Shop Smart
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-1/3">
                        <input
                            type="text"
                            placeholder="Search products, brands, or tags..."
                            className="w-full pl-10 pr-4 py-2 border border-mauve rounded-lg focus:outline-none focus:ring-2 focus:ring-lightLavender bg-blush placeholder-gray"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <Search className="absolute left-3 top-2.5 text-gray" size={18} />
                        {searchTerm && (
                            <X
                                className="absolute right-3 top-2.5 text-gray cursor-pointer hover:text-plum transition-colors duration-200"
                                size={18}
                                onClick={() => {
                                    setSearchTerm('');
                                    applyAllFilters('', priceRange, selectedBrands, ratingFilter, discountFilter);
                                }}
                            />
                        )}
                    </div>

                    {/* Filter Button */}
                    <button
                        className="flex items-center text-sm bg-plum text-ivory px-4 py-2 rounded-lg mt-2 md:mt-0 hover:bg-wine transition-colors duration-300 shadow-sm"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <SlidersHorizontal size={16} className="mr-2" />
                        Filters
                        <ChevronDown
                            size={16}
                            className={`ml-2 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`}
                        />
                    </button>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="mt-3 p-2 bg-moonstone/40 rounded-lg border border-blush shadow-inner">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Price Range Filter */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium mb-2 text-plum">Price Range</label>
                                <div className="flex space-x-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        className="w-1/2 px-3 py-2 border border-mauve rounded-md focus:outline-none focus:ring-1 focus:ring-lightLavender bg-white/80"
                                        value={priceRange.min}
                                        onChange={(e) => handlePriceChange(e, 'min')}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        className="w-1/2 px-3 py-2 border border-mauve rounded-md focus:outline-none focus:ring-1 focus:ring-lightLavender bg-white/80"
                                        value={priceRange.max}
                                        onChange={(e) => handlePriceChange(e, 'max')}
                                    />
                                </div>
                            </div>

                            {/* Brand Filter */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium mb-2 text-plum">Brands</label>
                                <div className="max-h-40 overflow-y-auto border border-mauve rounded-md p-2 bg-white/80 scrollbar-thin scrollbar-thumb-lavender">
                                    {availableBrands.map((brand, index) => (
                                        <div key={index} className="flex items-center mb-1 hover:bg-moonstone/30 px-1 py-0.5 rounded">
                                            <input
                                                type="checkbox"
                                                id={`brand-${index}`}
                                                checked={selectedBrands.includes(brand)}
                                                onChange={() => toggleBrandSelection(brand)}
                                                className="mr-2 accent-wine"
                                            />
                                            <label htmlFor={`brand-${index}`} className="text-sm text-wine cursor-pointer">{brand}</label>
                                        </div>
                                    ))}
                                    {availableBrands.length === 0 && <p className="text-sm text-gray italic">No brands available</p>}
                                </div>
                            </div>

                            {/* Rating Filter */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium mb-2 text-plum">Minimum Rating</label>
                                <select
                                    className="px-3 py-2 border border-mauve rounded-md bg-white/80 focus:outline-none focus:ring-1 focus:ring-lightLavender"
                                    value={ratingFilter}
                                    onChange={handleRatingChange}
                                >
                                    <option value="">All Ratings</option>
                                    <option value="4">4+ Stars</option>
                                    <option value="3">3+ Stars</option>
                                    <option value="2">2+ Stars</option>
                                    <option value="1">1+ Star</option>
                                </select>
                            </div>

                            {/* Discount Filter */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium mb-2 text-plum">Minimum Discount</label>
                                <select
                                    className="px-3 py-2 border border-mauve rounded-md bg-white/80 focus:outline-none focus:ring-1 focus:ring-lightLavender"
                                    value={discountFilter}
                                    onChange={handleDiscountChange}
                                >
                                    <option value="">All Discounts</option>
                                    <option value="50">50% or more</option>
                                    <option value="30">30% or more</option>
                                    <option value="20">20% or more</option>
                                    <option value="10">10% or more</option>
                                </select>
                            </div>
                        </div>

                        {/* Clear Filters Button */}
                        <div className="mt-4 flex justify-end">
                            <button
                                className="bg-plum text-white px-4 py-2 rounded-lg hover:bg-wine transition-colors duration-300 text-sm shadow-sm flex items-center"
                                onClick={handleClearFilters}
                            >
                                <X size={16} className="mr-1" />
                                Clear All Filters
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default SubNavbar;