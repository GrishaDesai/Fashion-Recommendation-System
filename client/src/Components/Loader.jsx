import React, { useState, useEffect } from 'react';
import shoppingbag from '../assets/image/shopping_bag.png'

const Loader = ({
    thoughts = [
        "Elevate Your Elegance....",
        "Rule Your Look...",
        "Your Style, Your Crown...",
        "Fashion Fit for Queens...",
        "Crown Your Closet...",
        "Wear the Crown of Style...",
        "Style Reimagined, Just for You..."

    ]
}) => {
    const [displayText, setDisplayText] = useState("");
    const [currentThoughtIndex, setCurrentThoughtIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(true);
    const [charIndex, setCharIndex] = useState(0);

    useEffect(() => {
        const currentThought = thoughts[currentThoughtIndex];

        if (isTyping) {
            // Typing phase
            if (charIndex < currentThought.length) {
                const typingTimer = setTimeout(() => {
                    setDisplayText(prevText => prevText + currentThought[charIndex]);
                    setCharIndex(prevIndex => prevIndex + 1);
                }, 50); // Speed of typing

                return () => clearTimeout(typingTimer);
            } else {
                // Pause before erasing
                const pauseTimer = setTimeout(() => {
                    setIsTyping(false);
                }, 1000);

                return () => clearTimeout(pauseTimer);
            }
        } else {
            // Erasing phase
            if (displayText.length > 0) {
                const erasingTimer = setTimeout(() => {
                    setDisplayText(prevText => prevText.slice(0, -1));
                }, 50); // Speed of erasing (faster than typing)

                return () => clearTimeout(erasingTimer);
            } else {
                // Move to next thought
                const nextThoughtTimer = setTimeout(() => {
                    const nextIndex = (currentThoughtIndex + 1) % thoughts.length;
                    setCurrentThoughtIndex(nextIndex);
                    setCharIndex(0);
                    setIsTyping(true);
                }, 500); // Pause before starting new thought

                return () => clearTimeout(nextThoughtTimer);
            }
        }
    }, [displayText, charIndex, currentThoughtIndex, isTyping, thoughts]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blush w-full fixed">
            {/* Image with scale animation */}
            <div className="mb-5">
                <img
                    src={shoppingbag || "/api/placeholder/150/150"}
                    alt="Loading"
                    className="w-80 h-80 object-contain animate-pulse transform transition-all duration-1000 scale-100 hover:scale-110"
                />
            </div>

            {/* Text with typing animation */}
            <div className="h-8 flex items-center justify-center min-w-64 text-center">
                <p className="text-plum text-lg font-medium">
                    {displayText}
                    <span className="inline-block w-1 h-5 ml-1 bg-gray-500 animate-pulse"></span>
                </p>
            </div>
        </div>
    );
};

export default Loader;