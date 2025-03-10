import { useState } from "react";

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

    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setAnswers({ ...answers, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setResult(null);

        try {
            const response = await fetch("https://tiyara.onrender.com/body-shape-quiz", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(answers)
            });

            if (!response.ok) {
                throw new Error("Failed to classify body shape");
            }

            const data = await response.json();
            setResult(data.bodyShape);
        } catch (err) {
            setError("Failed to classify body shape. Please try again.");
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-blush shadow-lg rounded-xl">
            <h2 className="text-xl font-bold mb-4 text-center">Find Your Body Shape</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Question 1 */}
                <div>
                    <label className="block font-medium">What is the widest part of your body?</label>
                    <select name="widestPart" onChange={handleChange} className="w-full p-2 border rounded-md">
                        <option value="">Select</option>
                        <option value="bust">I’m all bust</option>
                        <option value="middle">I’m full in the middle</option>
                        <option value="hips">These hips don’t lie</option>
                        <option value="even">Bust, waist, and hips are all relatively even</option>
                    </select>
                </div>

                {/* Question 2 */}
                <div>
                    <label className="block font-medium">Is your waist well-defined?</label>
                    <select name="waistDefined" onChange={handleChange} className="w-full p-2 border rounded-md">
                        <option value="">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                        <option value="slightly">Slightly</option>
                    </select>
                </div>

                {/* Question 3 */}
                <div>
                    <label className="block font-medium">How would you describe your hips?</label>
                    <select name="hipsDescription" onChange={handleChange} className="w-full p-2 border rounded-md">
                        <option value="">Select</option>
                        <option value="wider">Wider than bust and shoulders</option>
                        <option value="equal">Bust and hips are fairly equal</option>
                        <option value="narrow">Shoulders and bust are wider than hips</option>
                    </select>
                </div>

                {/* Question 4 */}
                <div>
                    <label className="block font-medium">Do you have broad shoulders?</label>
                    <select name="broadShoulders" onChange={handleChange} className="w-full p-2 border rounded-md">
                        <option value="">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>

                {/* Question 5 */}
                <div>
                    <label className="block font-medium">Where do you notice your weight changes first?</label>
                    <select name="weightChange" onChange={handleChange} className="w-full p-2 border rounded-md">
                        <option value="">Select</option>
                        <option value="upper">Upper body (arms, shoulders, back)</option>
                        <option value="hips">Hips and thighs</option>
                        <option value="midsection">Mid-section</option>
                        <option value="even">Evenly and everywhere</option>
                    </select>
                </div>

                {/* Question 6 */}
                <div>
                    <label className="block font-medium">Has your build ever been described as athletic?</label>
                    <select name="athleticBuild" onChange={handleChange} className="w-full p-2 border rounded-md">
                        <option value="">Select</option>
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                    </select>
                </div>

                {/* Question 7 */}
                <div>
                    <label className="block font-medium">How would you describe your derriere?</label>
                    <select name="derriere" onChange={handleChange} className="w-full p-2 border rounded-md">
                        <option value="">Select</option>
                        <option value="small">Small, yet mighty</option>
                        <option value="full">My trunk is full</option>
                        <option value="average">Somewhere in between</option>
                    </select>
                </div>

                {/* Question 8 */}
                <div>
                    <label className="block font-medium">How would you describe your bust?</label>
                    <select name="bustSize" onChange={handleChange} className="w-full p-2 border rounded-md">
                        <option value="">Select</option>
                        <option value="small">On the smaller side</option>
                        <option value="large">Large and busty</option>
                        <option value="average">Somewhere in between</option>
                    </select>
                </div>

                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
                    Find My Body Shape
                </button>
            </form>

            {result && <p className="mt-4 text-center font-semibold text-green-600">Your body shape: {result}</p>}
            {error && <p className="mt-4 text-center text-red-500">{error}</p>}
        </div>
    );
};

export default BodyShapeQuiz;
