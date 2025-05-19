import React, { useState } from 'react';

export default function SkintoneDetection() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [result, setResult] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedImage) {
            setResult('Please select an image.');
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedImage);

        try {
            const response = await fetch('/predict-skin-tone', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (data.error) {
                setResult(`Error: ${data.error}`);
            } else {
                if (data.skin_tone === 'light') {
                    setResult('Fair')
                } else if (data.skin_tone === 'mid-light'){
                    setResult('Medium')
                } else if (data.skin_tone === 'mid-dark') {
                    setResult('Olive')
                } else if (data.skin_tone === 'dark') {
                    setResult('Deep')
                }
            }
        } catch (error) {
            setResult(`Error: ${error.message}`);
        }
    };

    return (
        <div className="min-h-screen bg-moonstone flex items-center justify-center p-4">
            <div className="bg-ivory rounded-2xl shadow-xl p-8 max-w-md w-full">
                <h1 className="text-2xl font-bold text-plum text-center mb-6">
                    Skin Tone Detector
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col items-center">
                        <label
                            htmlFor="image-upload"
                            className="block text-sm font-medium text-wine mb-2"
                        >
                            Select an Image
                        </label>
                        <div className="relative">
                            <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setSelectedImage(e.target.files[0])}
                                className="block w-full text-sm text-gray 
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-lavender file:text-ivory
                                    hover:file:bg-lightLavender
                                    cursor-pointer"
                            />
                        </div>
                        {selectedImage && (
                            <p className="mt-2 text-sm text-wine">
                                Selected: {selectedImage.name}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-rose text-ivory font-semibold py-2 px-4 rounded-full
                            hover:bg-wine transition duration-300 ease-in-out
                            disabled:bg-gray disabled:cursor-not-allowed"
                        disabled={!selectedImage}
                    >
                        Predict Skin Tone
                    </button>
                </form>

                {result && (
                    <div className="mt-6 p-4 bg-mauve rounded-lg">
                        <h2 className="text-lg font-medium text-wine">
                            Result : <span className="font-normal">{result}</span>
                        </h2>
                    </div>
                )}
            </div>
        </div>
    );
}