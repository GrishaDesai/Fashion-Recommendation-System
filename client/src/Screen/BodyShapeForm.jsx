import { useState } from "react";
import placeholder from '../../src/assets/image/collage4.webp';
import { useNavigate } from "react-router-dom";

const BodyShapeForm = () => {
    const [formData, setFormData] = useState({
        bust: "",
        waist: "",
        highHip: "",
        hip: "",
        shoulder: ""
    });

    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [waistHipRatio, setWaistHipRatio] = useState(null);
    const [details, setDetails] = useState({});
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setResult(null);

        console.log("form data ", formData);

        try {
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await fetch(`${apiUrl}/body-shape/measurements`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error("Failed to fetch body shape");
            }

            const data = await response.json();

            setResult(data.bodyShape);
            setWaistHipRatio(data.waistHipRatio);
            setDetails(data.data);

        } catch (err) {
            setError("Failed to fetch body shape. Please check your inputs.");
        }
    };

    const fetchBodyShapeRecommendations = async (shape) => {
        try {
            setLoading(true);
            setError(null);

            const apiUrl = process.env.REACT_APP_API_URL;

            const response = await fetch(`${apiUrl}/recommend/body_shape/${shape}`);
            const data = await response.json();

            console.log(data.final_tag);
            console.log(data.recommended_products);

            navigate('/body-shape/recommendations', {
                state: {
                    recommendedProducts: data.recommended_products,
                    bodyShape: result,
                    bodyShapeData: details
                }
            });

            setRecommendations(data.final_tag);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch recommendations. Please try again.');
            setLoading(false);
            console.error('Error fetching body shape recommendations:', err);
        }
    };

    const handleButtonClick = () => {
        if (result) {
            fetchBodyShapeRecommendations(result);
        } else {
            setError('Please select a body shape first');
        }
    };

    return (
        <div className="min-h-screen w-full bg-wine flex flex-col md:flex-row p-4 sm:p-6 md:p-8 gap-4 sm:gap-6 justify-center items-start">
            {/* Form Section */}
            <div className="w-full md:w-1/2 lg:w-1/3 bg-ivory shadow-xl rounded-2xl p-4 sm:p-6 md:p-8 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-wine mb-4 sm:mb-6 text-center">
                    Calculate Your Body Shape
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    {["bust", "waist", "highHip", "hip", "shoulder"].map((field) => (
                        <div key={field} className="space-y-2">
                            <label className="block text-plum font-semibold text-sm sm:text-base capitalize">
                                {field.replace(/([A-Z])/g, " $1").trim()} Size (cm):
                            </label>
                            <input
                                type="number"
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.1"
                                className="w-full p-2 sm:p-3 bg-moonstone border border-mauve rounded-lg text-plum focus:ring-2 focus:ring-lavender placeholder-lavender text-sm sm:text-base"
                                placeholder={`Enter ${field} measurement`}
                            />
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="w-full bg-wine text-ivory p-2 sm:p-3 rounded-lg hover:bg-plum transition-colors duration-300 font-semibold text-sm sm:text-base"
                    >
                        Calculate Body Shape
                    </button>
                </form>

                {result && (
                    <div className="mt-4 sm:mt-6 space-y-3 text-center bg-lightLavender/20 p-3 sm:p-4 rounded-lg">
                        <p className="text-base sm:text-lg font-semibold text-lavender">
                            Your body shape: <span className="text-wine">{result}</span>
                        </p>
                        <p className="text-base sm:text-lg font-semibold text-lavender">
                            Waist-hip ratio: <span className="text-wine">{waistHipRatio}</span>
                        </p>
                    </div>
                )}
                {error && (
                    <p className="mt-4 sm:mt-6 text-center text-rose bg-rose/10 p-2 sm:p-3 rounded-lg text-sm sm:text-base">
                        {error}
                    </p>
                )}
            </div>

            {/* Results Section */}
            <div className="w-full md:w-1/2 lg:w-1/2 bg-ivory shadow-xl rounded-2xl p-4 sm:p-6 md:p-8 max-h-[90vh] overflow-y-auto">
                {Object.keys(details).length > 0 ? (
                    <div className="flex flex-col items-center justify-start">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-wine mb-4 text-center">
                            {details.Name}
                        </h1>
                        <p className="text-plum text-sm sm:text-base md:text-lg mb-4 sm:mb-6 text-center">
                            {details.Description}
                        </p>
                        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md flex justify-center">
                            <img
                                src={details.Image}
                                alt={details.Name}
                                className="w-full h-64 sm:h-80 md:h-96 object-fill rounded-lg mb-4 sm:mb-6 shadow-md"
                            />
                        </div>

                        {details.Recommendations && (
                            <div className="space-y-4 sm:space-y-6 w-full">
                                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-lavender mb-4">
                                    Style Recommendations
                                </h2>
                                {details.Recommendations.map((item, index) => (
                                    <div
                                        key={index}
                                        className="bg-moonstone p-3 sm:p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                                    >
                                        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-wine">
                                            {item.name}
                                        </h3>
                                        <p className="text-plum mt-2 text-sm sm:text-base">
                                            {item.description}
                                        </p>
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full object-cover rounded-md mt-3 sm:mt-4"
                                        />
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="w-full bg-wine text-ivory p-2 sm:p-3 rounded-lg hover:bg-plum transition-colors duration-300 font-semibold text-sm sm:text-base"
                                    onClick={handleButtonClick}
                                    disabled={!result}
                                >
                                    Browse clothes according to your body shape
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="overflow-hidden">
                        <img
                            src={placeholder}
                            alt="placeholder"
                            className="w-full h-[50vh] sm:h-[70vh] md:h-[90vh] object-cover"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default BodyShapeForm;