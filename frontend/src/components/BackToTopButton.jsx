// frontend/src/components/BackToTopButton.jsx

import React, { useState, useEffect } from 'react';

const BackToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    // This function checks the scroll position and updates the button's visibility.
    const toggleVisibility = () => {
        // If the page is scrolled more than 300 pixels, show the button
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // This function scrolls the window to the top smoothly.
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // This `useEffect` hook adds an event listener for the 'scroll' event
    // when the component mounts, and removes it when it unmounts.
    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);

        // Cleanup function to remove the listener to prevent memory leaks
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <button
            // The `visible` class is conditionally applied based on the state
            className={`back-to-top-button ${isVisible ? 'visible' : ''}`}
            onClick={scrollToTop}
            aria-label="Go to top"
        >
            {/* SVG for the up-arrow icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.47 4.72a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06L12 6.31l-6.97 6.97a.75.75 0 01-1.06-1.06l7.5-7.5z" />
                <path d="M11.47 10.72a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06L12 12.31l-6.97 6.97a.75.75 0 01-1.06-1.06l7.5-7.5z" />
            </svg>
        </button>
    );
};

export default BackToTopButton;