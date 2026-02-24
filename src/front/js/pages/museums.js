import React, { useState } from 'react';
import Jumbotron from '../../img/jumbotron.png';
import comingsoon from '../../img/comingsoon.png';
import '../../styles/museums.css';

/**
 * MUSEUMS COMPONENT
 * Showcases partner institutions and upcoming integrations.
 */
export const Museums = () => {
    // Single State Variable for active popup (more memory efficient than multiple booleans)
    const [activePopup, setActivePopup] = useState(null);

    // Museum Data Structure: Easy to scale and modify
    const museumData = [
        {
            id: 'met',
            name: 'The Metropolitan Museum of Art',
            location: 'New York, New York',
            image: Jumbotron,
            isComingSoon: false,
            facts: [
                'Founded in 1870',
                'Home to over 2 million works of art',
                'Collection estimated at over $50 billion',
                '3.2 million+ visitors in 2022'
            ]
        },
        {
            id: 'soon1',
            name: 'The Louvre',
            location: 'Paris, France',
            image: comingsoon,
            isComingSoon: true,
            facts: ['Integration in progress...', 'Stay tuned for the world\'s largest art museum.']
        },
        {
            id: 'soon2',
            name: 'British Museum',
            location: 'London, UK',
            image: comingsoon,
            isComingSoon: true,
            facts: ['Under development.', 'Access to 2 million years of human history coming soon.']
        }
    ];

    const togglePopup = (id, event) => {
        if (event) event.stopPropagation();
        setActivePopup(activePopup === id ? null : id);
    };

    return (
        <div className="museums-page-wrapper"> 
            <div className="container py-5">
                <header className="text-center mb-5">
                    <h1 className="museums-title">PARTNER INSTITUTIONS</h1>
                    <p className="lead text-muted">Click a museum frame to explore its heritage.</p>
                    <div className="gold-divider mx-auto"></div>
                </header>

                <div className="row g-4 justify-content-center">
                    {museumData.map((museum) => (
                        <div key={museum.id} className="col-lg-4 col-md-6">
                            {/* MUSEUM FRAME */}
                            <div className="museum-frame" onClick={() => togglePopup(museum.id)}>
                                <img 
                                    src={museum.image} 
                                    alt={museum.name} 
                                    className={`img-fluid museum-img ${museum.isComingSoon ? 'grayscale' : ''}`} 
                                    loading="lazy" 
                                />
                                <div className="frame-overlay">
                                    <span className="view-details">
                                        {museum.isComingSoon ? 'Coming Soon' : 'View Facts'}
                                    </span>
                                </div>

                                {/* POPUP OVERLAY */}
                                {activePopup === museum.id && (
                                    <div className="museum-popup shadow-lg animate__animated animate__fadeIn">
                                        <h3 className="popup-title">{museum.name}</h3>
                                        <p className="popup-location">
                                            <i className="fas fa-map-marker-alt me-2"></i>{museum.location}
                                        </p>
                                        
                                        <ul className="popup-list">
                                            {museum.facts.map((fact, idx) => (
                                                <li key={idx}>{fact}</li>
                                            ))}
                                        </ul>

                                        <button 
                                            className="btn popup-close-btn"
                                            onClick={(e) => togglePopup(museum.id, e)}
                                        >
                                            CLOSE
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="text-center mt-3">
                                <h5 className="museum-label">{museum.name}</h5>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};