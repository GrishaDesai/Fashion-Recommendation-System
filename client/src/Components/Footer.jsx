import React from 'react';
import '../Styles/footer.css';

export default function Footer() {
    return (
        <>
            <svg
                viewBox="0 0 1200 120"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                className="w-full h-36"
            >
                <path d="M0,80 C300,0 900,0 1200,80 V120 H0 Z" fill="#7d5168"></path>
            </svg>
            <div className="footer overflow-hidden w-screen relative bg-wine text-custom-white">
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4 sm:px-10 py-10">
                    {/* Logo Section */}
                    <div className="text-center sm:text-left">
                        <a className="text-custom-purple text-2xl font-bold" href="#">Tiyara</a>
                        <p className="mt-3">Crowning your style with Elegance and Glamour.</p>
                    </div>

                    {/* Company Links */}
                    <div className="text-center">
                        <span className="font-extrabold text-xl text-custom-purple">Company</span>
                        <ul className="mt-3 space-y-2">
                            <li className="hover:text-custom-purple cursor-pointer">About Us</li>
                            <li className="hover:text-custom-purple cursor-pointer">Services</li>
                            <li className="hover:text-custom-purple cursor-pointer">Our Works</li>
                            <li className="hover:text-custom-purple cursor-pointer">Playground</li>
                            <li className="hover:text-custom-purple cursor-pointer">Privacy Policy</li>
                            <li className="hover:text-custom-purple cursor-pointer">Terms & Conditions</li>
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div className="text-center sm:text-left">
                        <span className="font-extrabold text-xl text-custom-purple">Contact Us</span>
                        <div className="mt-3 space-y-4">
                            <p><i className="fa fa-envelope mr-2"></i> tiyara@gmail.com</p>
                            <p><i className="fa fa-phone mr-2"></i> +91-8888888888</p>
                            <p><i className="fa fa-map-marker mr-2"></i> 340 Main Street, Los Angeles, CA 90291</p>
                        </div>
                    </div>

                    {/* Stay Connected */}
                    <div className="text-center">
                        <span className="font-extrabold text-xl text-custom-purple">Let's Stay Connected</span>
                        <p className="mt-3 text-custom-purple">Enter your Email to stay updated.</p>
                        <div className="flex justify-center mt-3">
                            <input type="text" placeholder="Your Email" className="bg-transparent border-b-2 outline-none h-10 flex-1" disabled />
                            <button className="border-b-2 h-10 text-custom-purple hover:text-custom-white">Submit</button>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-custom-purple font-extrabold text-2xl">Follow Us</h3>
                            <div className="flex justify-center space-x-4 mt-2">
                                <i className="fa fa-linkedin bg-custom-purple p-3 rounded-full text-white"></i>
                                <i className="fa fa-instagram bg-custom-purple p-3 rounded-full text-white"></i>
                                <i className="fa fa-facebook bg-custom-purple p-3 rounded-full text-white"></i>
                                <i className="fa fa-github bg-custom-purple p-3 rounded-full text-white"></i>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Bottom Wave SVG */}
                <div className="wave-container -mt-24">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none" className="w-full">
                        <defs>
                            <path
                                id="gentle-wave"
                                d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18v44h-352z"
                            />
                        </defs>
                        <g className="waves">
                            <use xlinkHref="#gentle-wave" x="50" y="0" fill="#442e45" fillOpacity=".2" />
                            <use xlinkHref="#gentle-wave" x="50" y="3" fill="#442e45" fillOpacity=".5" />
                            <use xlinkHref="#gentle-wave" x="50" y="6" fill="#442e45" fillOpacity=".9" />
                        </g>
                    </svg>
                </div>
            </div>
        </>
    );
}
