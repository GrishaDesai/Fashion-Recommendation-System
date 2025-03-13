import { useState } from "react";

const BodyShapeForm = () => {
    const [formData, setFormData] = useState({
        bust: "",
        waist: "",
        highHip: "",
        hip: ""
    });

    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [waistHipRatio, setWaistHipRatio] = useState(null);

    // Handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setResult(null);

        try {
            const response = await fetch("http://localhost:5000/body-shape/measurements", {
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
        } catch (err) {
            setError("Failed to fetch body shape. Please check your inputs.");
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl">
            <h2 className="text-xl font-bold mb-4 text-center">Find Your Body Shape</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {["bust", "waist", "highHip", "hip"].map((field) => (
                    <div key={field}>
                        <label className="block font-medium capitalize">{field} size (cm):</label>
                        <input
                            type="number"
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                ))}

                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
                    Calculate Body Shape
                </button>
            </form>

            {result && <p className="mt-4 text-center font-semibold text-green-600">Your body shape: {result}</p>}
            {result && <p className="mt-4 text-center font-semibold text-green-600">Waist-hip ratio: {waistHipRatio}</p>}
            {error && <p className="mt-4 text-center text-red-500">{error}</p>}
        </div>
    );
};

export default BodyShapeForm;
