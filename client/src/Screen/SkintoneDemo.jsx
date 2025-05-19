import React, { useState } from 'react';
import '../Styles/skintone.css';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import skintoneimg from '../assets/image/skintone.png';
import SmallLoader from '../Components/SmallLoader';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';

export default function SkintoneDemo() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const toggleLogin = () => {
        setIsExpanded(prev => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedImage) {
            setResult('Please select an image.');
            return;
        }

        setIsLoading(true); // Show loading indicator
        setResult(''); // Clear previous results

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
                const toneMap = {
                    'light': 'Fair',
                    'mid-light': 'Medium',
                    'mid-dark': 'Olive',
                    'dark': 'Deep',
                };
                setResult(toneMap[data.skin_tone] || 'Unknown');
            }
        } catch (error) {
            setResult(`Error: ${error.message}`);
        } finally {
            setIsLoading(false); // Hide loading indicator
        }
    };

    return (
        <div className="wrapper relative mx-auto mt-24 shadow-xl overflow-hidden text-center">
            <Navbar/>
            <div className={`login-text ${isExpanded ? 'expand' : ''} bg-gradient-to-l from-lavender to-rose transition-all duration-500 ease-in-out`}>
                <button className="cta flex items-center justify-center text-xl bg-wine" onClick={toggleLogin}>
                    {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                </button>

                {!isExpanded && (
                    <p className="collapsed-msg absolute bottom-16 left-1/2 -translate-x-1/2 text-ivory text-3xl font-semibold">
                        Unlock your Perfect Skintone
                    </p>
                )}

                <div className={`text ${isExpanded ? 'show-hide' : ''}`}>
                    <div className="bg-ivory bg-opacity-90 rounded-xl shadow-lg p-8 max-w-md w-full mx-auto mt-4 text-center">
                        <h1 className="text-2xl font-bold text-plum mb-6">Skin Tone Detector</h1>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="flex flex-col items-center">
                                <label htmlFor="image-upload" className="mb-2 font-medium text-plum">
                                    Select an Image
                                </label>
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setSelectedImage(e.target.files[0])}
                                    className="text-sm text-wine cursor-pointer file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0 file:font-semibold
                                file:bg-lavender file:text-ivory hover:file:bg-lightLavender"
                                />
                                {selectedImage && (
                                    <p className="mt-2 text-sm text-rose">Selected: {selectedImage.name}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={!selectedImage || isLoading}
                                className="w-full bg-rose text-ivory font-semibold py-2 px-4 rounded-full
                            hover:bg-wine transition duration-300 ease-in-out
                            disabled:bg-gray disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Processing...' : 'Predict Skin Tone'}
                            </button>
                        </form>

                        {isLoading && (
                            <SmallLoader />
                        )}

                        {result && (
                            <div className="mt-5 p-3 bg-blush border border-rose text-rose rounded-lg">
                                <strong>Result:</strong> {result}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="call-text flex flex-col mt-24 justify-center items-center gap-3">
                <img src={skintoneimg} alt={skintoneimg} />
                <button className='bg-wine px-5 py-2 w-1/2 rounded-3xl shadow-2xl text-moonstone' onClick={() => navigate('/skintone-guide')}>Get Personalized Color Suggestions</button>
            </div>  
        </div>
    );
}