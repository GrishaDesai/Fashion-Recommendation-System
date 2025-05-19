import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info, Scissors, Palette } from 'lucide-react';
import Navbar from '../Components/Navbar';

const SkintoneGuide = () => {
    // State to manage collapsible sections
    const [expandedSections, setExpandedSections] = useState({
        fair: false,
        medium: false,
        olive: false,
        deep: false,
        tips: false
    });

    // Toggle function for collapsible sections
    const toggleSection = (section) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    // Hair color recommendations by skin tone
    const hairColorRecommendations = {
        fair: [
            { hex: '#F5F5DC', name: 'Platinum Blonde' },
            { hex: '#F0E68C', name: 'Golden Blonde' },
            { hex: '#D27D46', name: 'Strawberry Blonde' },
            { hex: '#8B4513', name: 'Light Auburn' },
            { hex: '#3B2F2F', name: 'Cool Brown' }
        ],
        medium: [
            { hex: '#D2B48C', name: 'Honey Blonde' },
            { hex: '#CD7F32', name: 'Caramel' },
            { hex: '#8B4513', name: 'Chestnut Brown' },
            { hex: '#4A0404', name: 'Mahogany' },
            { hex: '#A52A2A', name: 'Auburn' }
        ],
        olive: [
            { hex: '#826644', name: 'Golden Brown' },
            { hex: '#654321', name: 'Chocolate Brown' },
            { hex: '#3B2F2F', name: 'Dark Brown' },
            { hex: '#960018', name: 'Deep Burgundy' },
            { hex: '#000000', name: 'Black with Brown Highlights' }
        ],
        deep: [
            { hex: '#301934', name: 'Deep Violet Black' },
            { hex: '#000000', name: 'Blue-Black' },
            { hex: '#654321', name: 'Rich Brown' },
            { hex: '#800020', name: 'Burgundy' },
            { hex: '#6F4E37', name: 'Dark Caramel Highlights' }
        ]
    };

    // Enhanced color objects with names for better display
    const colorSwatches = {
        fair: {
            softPastels: [
                { hex: '#FFC1CC', name: 'Light Pink' },
                { hex: '#A2CFFE', name: 'Baby Blue' },
                { hex: '#E6E6FA', name: 'Lavender' },
                { hex: '#98FF98', name: 'Mint Green' },
                { hex: '#FFDFBA', name: 'Peach' },
                { hex: '#D8BFD8', name: 'Thistle' },
                { hex: '#CCCCFF', name: 'Periwinkle' },
                { hex: '#E0FFFF', name: 'Light Cyan' }
            ],
            jewelTones: [
                { hex: '#0F52BA', name: 'Sapphire Blue' },
                { hex: '#50C878', name: 'Emerald Green' },
                { hex: '#E0115F', name: 'Ruby Red' },
                { hex: '#4B0082', name: 'Indigo' },
                { hex: '#800080', name: 'Purple' },
                { hex: '#008080', name: 'Teal' },
                { hex: '#B87333', name: 'Copper' },
                { hex: '#40E0D0', name: 'Turquoise' }
            ],
            neutrals: [
                { hex: '#FFFFF0', name: 'Ivory' },
                { hex: '#D3D3D3', name: 'Light Gray' },
                { hex: '#C19A6B', name: 'Taupe' },
                { hex: '#E8D2A6', name: 'Champagne' },
                { hex: '#F5F5DC', name: 'Beige' },
                { hex: '#A67B5B', name: 'Camel' },
                { hex: '#36454F', name: 'Charcoal' },
                { hex: '#000080', name: 'Navy Blue' }
            ],
        },
        medium: {
            warmTones: [
                { hex: '#FF6F61', name: 'Coral' },
                { hex: '#FFC107', name: 'Mustard Yellow' },
                { hex: '#E65100', name: 'Burnt Orange' },
                { hex: '#FF7518', name: 'Pumpkin' },
                { hex: '#DA9100', name: 'Golden Yellow' },
                { hex: '#BF4F51', name: 'Marsala' },
                { hex: '#E25822', name: 'Flame' },
                { hex: '#CC7722', name: 'Ochre' }
            ],
            richNeutrals: [
                { hex: '#C19A6B', name: 'Camel' },
                { hex: '#556B2F', name: 'Olive Green' },
                { hex: '#A9A9A9', name: 'Warm Gray' },
                { hex: '#D2B48C', name: 'Tan' },
                { hex: '#5D3954', name: 'Plum' },
                { hex: '#A67B5B', name: 'French Beige' },
                { hex: '#8A3324', name: 'Burnt Sienna' },
                { hex: '#483C32', name: 'Taupe Brown' }
            ],
            boldColors: [
                { hex: '#008080', name: 'Teal' },
                { hex: '#4169E1', name: 'Royal Blue' },
                { hex: '#FF00FF', name: 'Magenta' },
                { hex: '#007BA7', name: 'Cerulean' },
                { hex: '#00A36C', name: 'Jade Green' },
                { hex: '#800020', name: 'Burgundy' },
                { hex: '#9370DB', name: 'Medium Purple' },
                { hex: '#0047AB', name: 'Cobalt Blue' }
            ],
        },
        olive: {
            earthyTones: [
                { hex: '#4A5D23', name: 'Olive Green' },
                { hex: '#E2725B', name: 'Terracotta' },
                { hex: '#B7410E', name: 'Rust' },
                { hex: '#8B4513', name: 'Saddle Brown' },
                { hex: '#6B8E23', name: 'Olive Drab' },
                { hex: '#CD853F', name: 'Peru' },
                { hex: '#966F33', name: 'Wood Brown' },
                { hex: '#806D5A', name: 'Taupe Gray' }
            ],
            jewelTones: [
                { hex: '#4B0082', name: 'Deep Purple' },
                { hex: '#2E8B57', name: 'Emerald Green' },
                { hex: '#0F52BA', name: 'Sapphire Blue' },
                { hex: '#800080', name: 'Purple' },
                { hex: '#9F2B68', name: 'Amethyst' },
                { hex: '#800020', name: 'Burgundy' },
                { hex: '#006400', name: 'Dark Green' },
                { hex: '#B87333', name: 'Copper' }
            ],
            warmNeutrals: [
                { hex: '#FFFDD0', name: 'Cream' },
                { hex: '#C3B091', name: 'Khaki' },
                { hex: '#E4D96F', name: 'Caramel' },
                { hex: '#C2B280', name: 'Sand' },
                { hex: '#826644', name: 'Umber' },
                { hex: '#CBA135', name: 'Mustard' },
                { hex: '#A67B5B', name: 'French Beige' },
                { hex: '#483C32', name: 'Taupe Brown' }
            ],
        },
        deep: {
            boldColors: [
                { hex: '#FF0000', name: 'Bright Red' },
                { hex: '#0047AB', name: 'Cobalt Blue' },
                { hex: '#FF00FF', name: 'Fuchsia' },
                { hex: '#FFA500', name: 'Orange' },
                { hex: '#9370DB', name: 'Medium Purple' },
                { hex: '#00FFFF', name: 'Cyan' },
                { hex: '#32CD32', name: 'Lime Green' },
                { hex: '#FF69B4', name: 'Hot Pink' }
            ],
            metallics: [
                { hex: '#FFD700', name: 'Gold' },
                { hex: '#CD7F32', name: 'Bronze' },
                { hex: '#B87333', name: 'Copper' },
                { hex: '#C0C0C0', name: 'Silver' },
                { hex: '#D4AF37', name: 'Old Gold' },
                { hex: '#E6BE8A', name: 'Pale Gold' },
                { hex: '#CF9F52', name: 'Metallic Gold' },
                { hex: '#B76E79', name: 'Rose Gold' }
            ],
            deepNeutrals: [
                { hex: '#36454F', name: 'Charcoal' },
                { hex: '#000080', name: 'Navy' },
                { hex: '#4A3728', name: 'Chocolate Brown' },
                { hex: '#5D3954', name: 'Plum' },
                { hex: '#800020', name: 'Burgundy' },
                { hex: '#008080', name: 'Teal' },
                { hex: '#483D8B', name: 'Dark Slate Blue' },
                { hex: '#2F4F4F', name: 'Dark Slate Gray' }
            ],
        },
    };

    // Color palette for skin tone representation
    const skinToneColors = {
        fair: '#FFE4E1',
        medium: '#fdd9bc',
        olive: '#f5c398',
        deep: '#c69274'
    };

    // Makeup recommendation data
    const makeupRecommendations = {
        fair: {
            lipstick: ['#F4C2C2', '#FFCBA4', '#CC0066'],
            blush: ['#FFB6C1', '#F69785'],
            eyeshadow: ['#C0C0C0', '#87CEEB', '#D2B48C', '#FFC0CB']
        },
        medium: {
            lipstick: ['#FF7F50', '#B22222', '#AF4035'],
            blush: ['#FFA07A', '#FF7F50', '#CD853F'],
            eyeshadow: ['#8B4513', '#FFD700', '#CD7F32', '#008080']
        },
        olive: {
            lipstick: ['#B22222', '#AE4A60', '#702963'],
            blush: ['#FFA07A', '#FF7F50', '#CD853F'],
            eyeshadow: ['#CD7F32', '#B87333', '#702963', '#2E8B57']
        },
        deep: {
            lipstick: ['#9C2542', '#8B008B', '#B22222'],
            blush: ['#E5823A', '#CD853F', '#C3447A'],
            eyeshadow: ['#FFD700', '#CD7F32', '#800080', '#2E8B57']
        }
    };

    // Render a row of color swatches with labels
    const ColorSwatchRow = ({ colors }) => {
        return (
            <div className="flex flex-wrap gap-4 mt-3 mb-4">
                {colors.map((color, idx) => (
                    <div key={idx} className="flex flex-col items-center group">
                        <div
                            className="w-11 h-11 rounded-full border border-gray-300 shadow-md transform transition-transform group-hover:scale-110"
                            style={{ backgroundColor: color.hex }}
                        >
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs transition-opacity duration-300">
                                {color.hex}
                            </div>
                        </div>
                        <span className="text-sm mt-2 font-medium text-center">{color.name}</span>
                        <span className="text-xs text-gray-500">{color.hex}</span>
                    </div>
                ))}
            </div>
        );
    };

    // Render makeup color swatches
    const MakeupSwatches = ({ type, colors }) => {
        return (
            <div className="flex items-center mt-2 mb-3">
                <span className="font-semibold mr-3 w-20 text-gray-800">{type}:</span>
                <div className="flex gap-2">
                    {colors.map((color, idx) => (
                        <div
                            key={idx}
                            className="w-8 h-8 rounded-full border border-gray-300 shadow hover:shadow-md transform transition-transform hover:scale-110"
                            style={{ backgroundColor: color }}
                            title={color}
                        >
                            <div className="opacity-0 hover:opacity-100 absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs transition-opacity duration-300">
                                {color}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Section component for each skin tone
    const SkinToneSection = ({ tone, title, description }) => {
        return (
            <>
                <div className="mb-6 bg-white rounded-xl shadow-lg overflow-hidden">
                    <button
                        onClick={() => toggleSection(tone)}
                        className="w-full flex justify-between items-center p-4 text-left ease-in-out duration-500 hover:bg-rose-100"
                        style={{ backgroundColor: `${skinToneColors[tone]}30` }}
                    >
                        <div className="flex items-center">
                            <div
                                className="w-8 h-8 rounded-full mr-3 border border-gray-300"
                                style={{ backgroundColor: skinToneColors[tone] }}
                            ></div>
                            <span className="text-2xl font-semibold text-plum">{title}</span>
                        </div>
                        {expandedSections[tone] ? <ChevronUp className="text-gray-600" /> : <ChevronDown className="text-gray-600" />}
                    </button>

                    <div
                        className={`transition-all duration-500 ease-in-out overflow-hidden ${expandedSections[tone] ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                            }`}
                    >
                        <div className="p-6 bg-gradient-to-br from-white to-gray-50">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Left column - Skin tone info */}
                                <div className="md:w-1/3">
                                    <div className="bg-white p-4 rounded-xl shadow-md mb-4">
                                        <div className="w-full h-24 rounded-lg mb-4" style={{ backgroundColor: skinToneColors[tone] }}></div>
                                        <p className="text-gray-700 leading-relaxed tracking-wide">{description}</p>
                                    </div>

                                    <div className="bg-white p-4 rounded-xl shadow-md mb-4">
                                        <h3 className="text-lg font-bold mb-2 flex items-center text-purple-900">
                                            <Palette size={18} className="mr-2 text-purple-700" />
                                            <span className="border-b-2 border-purple-300 pb-1">Makeup Recommendations</span>
                                        </h3>
                                        <MakeupSwatches type="Lipstick" colors={makeupRecommendations[tone].lipstick} />
                                        <MakeupSwatches type="Blush" colors={makeupRecommendations[tone].blush} />
                                        <MakeupSwatches type="Eyeshadow" colors={makeupRecommendations[tone].eyeshadow} />
                                    </div>

                                    <div className="bg-white p-4 rounded-xl shadow-md">
                                        <h3 className="text-lg font-bold mb-3 flex items-center text-purple-900">
                                            <Scissors size={18} className="mr-2 text-purple-700" />
                                            <span className="border-b-2 border-purple-300 pb-1">Best Hair Colors</span>
                                        </h3>
                                        <div className="space-y-3">
                                            {hairColorRecommendations[tone].map((color, idx) => (
                                                <div key={idx} className="flex items-center">
                                                    <div
                                                        className="w-8 h-8 rounded-full mr-2 border border-gray-300 shadow-sm"
                                                        style={{ backgroundColor: color.hex }}
                                                    ></div>
                                                    <span className="text-gray-800 font-medium">{color.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right column - Color recommendations */}
                                <div className="md:w-2/3">
                                    <div className="bg-white p-4 rounded-xl shadow-md mb-4">
                                        <h3 className="text-xl font-bold mb-4 text-purple-900 border-b-2 border-purple-200 pb-2 inline-block">
                                            Best Color Choices
                                        </h3>

                                        {Object.keys(colorSwatches[tone]).map((category, idx) => {
                                            const categoryTitle = {
                                                softPastels: 'Soft Pastels',
                                                jewelTones: 'Jewel Tones',
                                                neutrals: 'Neutrals',
                                                warmTones: 'Warm Tones',
                                                richNeutrals: 'Rich Neutrals',
                                                boldColors: 'Bold Colors',
                                                earthyTones: 'Earthy Tones',
                                                warmNeutrals: 'Warm Neutrals',
                                                metallics: 'Metallics',
                                                deepNeutrals: 'Deep Neutrals'
                                            }[category];

                                            return (
                                                <div key={idx} className="mb-6 bg-gradient-to-r from-white to-purple-50 rounded-lg p-4 shadow-sm">
                                                    <h4 className="font-bold text-lg text-purple-800 mb-3">{categoryTitle}</h4>
                                                    <ColorSwatchRow colors={colorSwatches[tone][category]} />
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="bg-white p-4 rounded-xl shadow-md">
                                        <h3 className="text-xl font-bold mb-3 text-purple-900 border-b-2 border-purple-200 pb-2 inline-block">
                                            Colors to Avoid
                                        </h3>
                                        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                                            <p className="text-gray-800 leading-relaxed tracking-wide">
                                                {tone === 'fair' && 'Very pale colors like white or beige, as they can wash out the complexion and create a bland appearance. These colors can make fair skin look washed out or highlight redness.'}
                                                {tone === 'medium' && 'Colors that are too close to the skin tone, like certain beiges or tans, which can make the complexion look flat. These create a "blending in" effect that lacks dimension and contrast.'}
                                                {tone === 'olive' && 'Colors with too much yellow or green (e.g., chartreuse or lime green), as they can clash with the natural undertone of olive skin. These shades can emphasize sallowness in the complexion.'}
                                                {tone === 'deep' && 'Very muted or pastel colors, as they can appear dull against the richness of the skin tone. These lack the vibrancy needed to complement deep skin and can make the complexion appear ashy.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    return (

        <div className="min-h-screen bg-gradient-to-b from-rose to-purple-100 pb-8 pt-20 px-4">
            <Navbar />
            <div className="max-w-6xl mx-auto">
                <header className="text-center mb-10 bg-white bg-opacity-60 rounded-2xl p-6 shadow-lg">
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-wine to-lightLavender mb-3">
                        Skin Tone Color Guide
                    </h1>
                    <p className="text-xl text-lavender font-normal tracking-wide">
                        Find the perfect colors for your unique complexion
                    </p>
                    <div className="mt-4 max-w-2xl mx-auto">
                        <p className="text-gray-700 italic leading-relaxed">
                            Discover clothing colors, makeup palettes, and hair colors that perfectly complement your natural beauty
                        </p>
                    </div>
                </header>

                {/* Color Chart Overview */}
                <div className="mb-8 p-4 bg-white rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold text-lavender mb-4 text-center">Skin Tone Spectrum</h2>
                    <div className="flex justify-between items-center h-16 rounded-lg overflow-hidden shadow-inner">
                        {Object.entries(skinToneColors).map(([tone, color], idx) => (
                            <div
                                key={idx}
                                className="h-full flex-1 flex items-center justify-center text-xs font-bold"
                                style={{ backgroundColor: color }}
                            >
                                <span className="bg-white bg-opacity-70 px-2 py-1 rounded">{tone.charAt(0).toUpperCase() + tone.slice(1)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Skin Tone Sections */}
                <SkinToneSection
                    tone="fair"
                    title="Fair Skin Tone"
                    description="Fair skin tones often have light undertones (cool, warm, or neutral). Colors that enhance fair skin tones are typically soft or bold jewel tones that create contrast without overwhelming the complexion."
                />

                <SkinToneSection
                    tone="medium"
                    title="Medium Skin Tone"
                    description="Medium skin tones often have a balanced undertone, leaning slightly warm or neutral. They can handle a broader range of colors, especially those with warmth or vibrancy."
                />

                <SkinToneSection
                    tone="olive"
                    title="Olive Skin Tone"
                    description="Olive skin tones often have a greenish or yellowish undertone, which pairs well with earthy and rich colors. The natural warmth in olive tones allows for both bold and muted shades."
                />

                <SkinToneSection
                    tone="deep"
                    title="Deep Skin Tone"
                    description="Deep skin tones have rich, dark undertones that look stunning with high-contrast colors, bold hues, and metallics. These tones can carry vibrant shades that might overwhelm lighter complexions."
                />

                {/* General Tips Section */}
                <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
                    <button
                        onClick={() => toggleSection('tips')}
                        className="w-full flex justify-between items-center p-6 text-left bg-gradient-to-r from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 transition-colors duration-200"
                    >
                        <span className="text-2xl font-semibold text-purple-900 tracking-wide">Expert Color Tips</span>
                        {expandedSections.tips ? <ChevronUp className="text-purple-900" /> : <ChevronDown className="text-purple-900" />}
                    </button>

                    {expandedSections.tips && (
                        <div className="p-6 bg-gradient-to-br from-white to-purple-50">
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-400">
                                    <h3 className="font-bold text-lg text-purple-900 mb-3">Understanding Undertones</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Determine if your skin has <span className="text-blue-600 font-medium">cool</span> (pink/blue),
                                        <span className="text-orange-600 font-medium"> warm</span> (yellow/peach), or
                                        <span className="text-gray-600 font-medium"> neutral</span> undertones to refine color choices.
                                        Cool undertones pair better with blues and purples, while warm undertones suit oranges and yellows.
                                    </p>
                                </div>

                                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-400">
                                    <h3 className="font-bold text-lg text-purple-900 mb-3">Contrast Principles</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Lighter skin tones benefit from higher contrast (e.g., fair skin with sapphire blue),
                                        while deeper tones can handle both high contrast and monochromatic looks
                                        (e.g., deep skin with chocolate brown or vibrant jewel tones).
                                    </p>
                                </div>

                                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-400">
                                    <h3 className="font-bold text-lg text-purple-900 mb-3">Experiment & Express</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Personal style and confidence play a big role. Try different colors and observe how they
                                        affect your appearance and mood. The best color palette is one that makes you feel
                                        confident and authentically expresses your personality.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 bg-white p-6 rounded-lg shadow-md border-t-4 border-purple-400">
                                <h3 className="font-bold text-xl text-purple-900 mb-3">How to Test Colors for Your Skin Tone</h3>
                                <div className="md:flex gap-6">
                                    <div className="md:w-1/2">
                                        <ol className="space-y-3">
                                            <li className="flex items-start">
                                                <span className="bg-purple-100 text-purple-800 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-1">1</span>
                                                <span className="text-gray-700">Hold the color up to your face in <strong>natural light</strong> (artificial lighting can distort colors)</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="bg-purple-100 text-purple-800 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-1">2</span>
                                                <span className="text-gray-700">Notice if your skin looks more <strong>vibrant</strong> or <strong>dull</strong> against the color</span>
                                            </li>
                                        </ol>
                                    </div>
                                    <div className="md:w-1/2 mt-3 md:mt-0">
                                        <ol className="space-y-3" start="3">
                                            <li className="flex items-start">
                                                <span className="bg-purple-100 text-purple-800 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-1">3</span>
                                                <span className="text-gray-700">Check if any skin <strong>imperfections</strong> become more or less noticeable</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="bg-purple-100 text-purple-800 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-1">4</span>
                                                <span className="text-gray-700">Observe if your <strong>eyes</strong> and natural features <strong>stand out</strong> more</span>
                                            </li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <footer className="mt-12 text-center text-gray-600 text-sm">
                    <p className="mb-2">Designed to help you discover your perfect color palette</p>
                    <p>© 2025 Skin Tone Color Guide</p>
                </footer>
            </div>
        </div>
    );
};

export default SkintoneGuide;