import { useState } from "react";
import { useNavigate } from "react-router-dom";
import placeholder from '../../src/assets/image/collage4.webp'


const BodyShapeQuiz = () => {
    const [answers, setAnswers] = useState({
        widestPart: "",
        waistDefined: "",
        hipsDescription: "",
        broadShoulders: "",
        weightChange: "",
        athleticBuild: "",
        derriere: "",
        bustSize: ""
    });

    const [result, setResult] = useState('');
    const [details, setDetails] = useState({});
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setAnswers({ ...answers, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setResult(null);

        try {
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await fetch(`${apiUrl}/body-shape-quiz`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(answers)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to classify body shape");
            }

            console.log("Body Shape:", data.bodyShape);
            console.log("Additional Data:", data.data);

            setResult(data.bodyShape);
            setDetails(data.data);
        } catch (err) {
            setError(err.message || "Failed to classify body shape. Please try again.");
        }
    };

    const fetchBodyShapeRecommendations = async (shape) => {
        try {
            setError(null);

            const apiUrl = process.env.REACT_APP_API_URL;

            // Call the API endpoint you've defined in your Flask app
            const response = await fetch(`${apiUrl}/recommend/body_shape/${shape}`);

            const data = await response.json();

            // Set the recommendations from the response
            console.log(data.final_tag);
            console.log(data.recommended_products);

            navigate('/body-shape/recommendations', {
                state: {
                    recommendedProducts: data.recommended_products,
                    bodyShape: result,
                    bodyShapeData: details
                }
            });

        } catch (err) {
            setError('Failed to fetch recommendations. Please try again.');
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
        <div className="min-h-screen bg-wine p-4 sm:p-6 md:p-8">
            <div className="container mx-auto">
                <div className="flex flex-col lg:flex-row gap-6 justify-center">
                    {/* Quiz Form Section */}
                    <div className="w-full lg:w-1/3 bg-ivory shadow-2xl rounded-2xl p-4 sm:p-6 md:p-8 mb-6 lg:mb-0 overflow-y-auto max-h-screen">
                        <h2 className="text-2xl sm:text-3xl font-bold text-wine mb-4 sm:mb-6 text-center">
                            Discover Your Body Shape
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                            <div className="space-y-3 sm:space-y-4">
                                {/* Question 1 */}
                                <div className="space-y-1 sm:space-y-2">
                                    <label className="block text-plum font-semibold text-xs sm:text-sm">
                                        What is the widest part of your body?
                                    </label>
                                    <select
                                        name="widestPart"
                                        onChange={handleChange}
                                        className="w-full p-2 sm:p-3 bg-moonstone border border-mauve rounded-lg text-plum focus:ring-2 focus:ring-lavender focus:border-transparent transition-all text-sm sm:text-base"
                                    >
                                        <option value="">Select an option</option>
                                        <option value="bust">I'm all bust</option>
                                        <option value="middle">I'm full in the middle</option>
                                        <option value="hips">These hips don't lie</option>
                                        <option value="even">Bust, waist, and hips are all relatively even</option>
                                    </select>
                                </div>

                                {/* Question 2 */}
                                <div className="space-y-1 sm:space-y-2">
                                    <label className="block text-plum font-semibold text-xs sm:text-sm">
                                        Is your waist well-defined?
                                    </label>
                                    <select
                                        name="waistDefined"
                                        onChange={handleChange}
                                        className="w-full p-2 sm:p-3 bg-moonstone border border-mauve rounded-lg text-plum focus:ring-2 focus:ring-lavender focus:border-transparent transition-all text-sm sm:text-base"
                                    >
                                        <option value="">Select an option</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                        <option value="slightly">Slightly</option>
                                    </select>
                                </div>

                                {/* Question 3 */}
                                <div className="space-y-1 sm:space-y-2">
                                    <label className="block text-plum font-semibold text-xs sm:text-sm">
                                        How would you describe your hips?
                                    </label>
                                    <select
                                        name="hipsDescription"
                                        onChange={handleChange}
                                        className="w-full p-2 sm:p-3 bg-moonstone border border-mauve rounded-lg text-plum focus:ring-2 focus:ring-lavender focus:border-transparent transition-all text-sm sm:text-base"
                                    >
                                        <option value="">Select an option</option>
                                        <option value="wider">Wider than bust and shoulders</option>
                                        <option value="equal">Bust and hips are fairly equal</option>
                                        <option value="narrow">Shoulders and bust are wider than hips</option>
                                    </select>
                                </div>

                                {/* Question 4 */}
                                <div className="space-y-1 sm:space-y-2">
                                    <label className="block text-plum font-semibold text-xs sm:text-sm">
                                        Do you have broad shoulders?
                                    </label>
                                    <select
                                        name="broadShoulders"
                                        onChange={handleChange}
                                        className="w-full p-2 sm:p-3 bg-moonstone border border-mauve rounded-lg text-plum focus:ring-2 focus:ring-lavender focus:border-transparent transition-all text-sm sm:text-base"
                                    >
                                        <option value="">Select an option</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </select>
                                </div>

                                {/* Question 5 */}
                                <div className="space-y-1 sm:space-y-2">
                                    <label className="block text-plum font-semibold text-xs sm:text-sm">
                                        Where do you notice your weight changes first?
                                    </label>
                                    <select
                                        name="weightChange"
                                        onChange={handleChange}
                                        className="w-full p-2 sm:p-3 bg-moonstone border border-mauve rounded-lg text-plum focus:ring-2 focus:ring-lavender focus:border-transparent transition-all text-sm sm:text-base"
                                    >
                                        <option value="">Select an option</option>
                                        <option value="upper">Upper body (arms, shoulders, back)</option>
                                        <option value="hips">Hips and thighs</option>
                                        <option value="midsection">Mid-section</option>
                                        <option value="even">Evenly and everywhere</option>
                                    </select>
                                </div>

                                {/* Question 6 */}
                                <div className="space-y-1 sm:space-y-2">
                                    <label className="block text-plum font-semibold text-xs sm:text-sm">
                                        Has your build ever been described as athletic?
                                    </label>
                                    <select
                                        name="athleticBuild"
                                        onChange={handleChange}
                                        className="w-full p-2 sm:p-3 bg-moonstone border border-mauve rounded-lg text-plum focus:ring-2 focus:ring-lavender focus:border-transparent transition-all text-sm sm:text-base"
                                    >
                                        <option value="">Select an option</option>
                                        <option value="no">No</option>
                                        <option value="yes">Yes</option>
                                    </select>
                                </div>

                                {/* Question 7 */}
                                <div className="space-y-1 sm:space-y-2">
                                    <label className="block text-plum font-semibold text-xs sm:text-sm">
                                        How would you describe your derriere?
                                    </label>
                                    <select
                                        name="derriere"
                                        onChange={handleChange}
                                        className="w-full p-2 sm:p-3 bg-moonstone border border-mauve rounded-lg text-plum focus:ring-2 focus:ring-lavender focus:border-transparent transition-all text-sm sm:text-base"
                                    >
                                        <option value="">Select an option</option>
                                        <option value="small">Small, yet mighty</option>
                                        <option value="full">My trunk is full</option>
                                        <option value="average">Somewhere in between</option>
                                    </select>
                                </div>

                                {/* Question 8 */}
                                <div className="space-y-1 sm:space-y-2">
                                    <label className="block text-plum font-semibold text-xs sm:text-sm">
                                        How would you describe your bust?
                                    </label>
                                    <select
                                        name="bustSize"
                                        onChange={handleChange}
                                        className="w-full p-2 sm:p-3 bg-moonstone border border-mauve rounded-lg text-plum focus:ring-2 focus:ring-lavender focus:border-transparent transition-all text-sm sm:text-base"
                                    >
                                        <option value="">Select an option</option>
                                        <option value="small">On the smaller side</option>
                                        <option value="large">Large and busty</option>
                                        <option value="average">Somewhere in between</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-wine text-ivory p-2 sm:p-3 rounded-lg hover:bg-plum focus:ring-4 focus:ring-lavender/50 transition-all duration-300 font-semibold text-sm sm:text-base"
                            >
                                Find My Body Shape
                            </button>
                        </form>

                        {result && (
                            <p className="mt-4 sm:mt-6 text-center text-base sm:text-lg font-semibold text-lavender bg-lightLavender/20 p-3 sm:p-4 rounded-lg">
                                Your body shape: <span className="text-wine">{result}</span>
                            </p>
                        )}
                        {error && (
                            <p className="mt-4 sm:mt-6 text-center text-rose bg-rose/10 p-3 sm:p-4 rounded-lg text-sm sm:text-base">
                                {error}
                            </p>
                        )}
                    </div>

                    {/* Results Section */}
                    <div className="w-full md:w-1/2 bg-ivory shadow-xl rounded-2xl p-8 max-h-screen overflow-y-auto">
                        {Object.keys(details).length > 0 ? (
                            <div className="flex flex-col items-center justify-start">
                                <h1 className="text-3xl font-bold text-wine mb-4 text-center">{details.Name}</h1>
                                <p className="text-plum text-lg mb-6 text-center">{details.Description}</p>
                                <div className="w-full max-w-md flex justify-center">
                                    <img
                                        src={details.Image}
                                        alt={details.Name}
                                        className="w-3/4 h-96 object-fill rounded-lg mb-6 shadow-md"
                                    />
                                </div>

                                {details.Recommendations && (
                                    <div className="space-y-6 w-full">
                                        <h2 className="text-2xl font-semibold text-lavender mb-4">Style Recommendations</h2>
                                        {details.Recommendations.map((item, index) => (
                                            <div
                                                key={index}
                                                className="bg-moonstone p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                                            >
                                                <h3 className="text-xl font-semibold text-wine">{item.name}</h3>
                                                <p className="text-plum mt-2">{item.description}</p>
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full object-cover rounded-md mt-4"
                                                />
                                            </div>
                                        ))}
                                        <button
                                            type="submit"
                                            className="w-full bg-wine text-ivory p-3 rounded-lg hover:bg-plum transition-colors duration-300 font-semibold"
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
            </div>
        </div>
    );
};

export default BodyShapeQuiz;