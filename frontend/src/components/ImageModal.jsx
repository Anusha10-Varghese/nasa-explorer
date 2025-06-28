// frontend/src/components/ImageModal.jsx

import React from 'react';

const ImageModal = ({ imageUrl, onClose }) => {
    // If no imageUrl is passed, the component renders nothing (it's hidden).
    if (!imageUrl) return null;

    return (
        // The dark semi-transparent background overlay.
        // Clicking this overlay will call the `onClose` function.
        <div className="image-modal-overlay" onClick={onClose}>
            
            {/* The main content area for the image. */}
            {/* We stop click propagation here so that clicking the image itself doesn't close the modal. */}
            <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                
                {/* The large image */}
                <img src={imageUrl} alt="Mars Rover full size view" />
                
                {/* The close button */}
                <button className="image-modal-close-button" onClick={onClose}>
                    × {/* A simple 'X' character for the icon */}
                </button>

            </div>
        </div>
    );
};

export default ImageModal;