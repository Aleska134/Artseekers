import React, { useState } from 'react';
import Jumbotron from '../../img/jumbotron.png';
import comingsoon from '../../img/comingsoon.png';
import '../../styles/museums.css';

export const Museums = () => {
    const [showPopup, setShowPopup] = useState({
        jumbotron: false,
        comingSoon1: false,
        comingSoon2: false,
    });

    const togglePopup = (popupName, event) => {
        if (event) event.stopPropagation();
        setShowPopup(prev => ({
            ...prev,
            [popupName]: !prev[popupName],
        }));
    };

    return (
        <div className="parent-container"> 
            <div className="heading">
                <h1>Our Featured Museums</h1>
                <h6>Click each museum to learn more!</h6>
            </div>
            <div className="content-container">
                {/* Jumbotron Image */}
                <div className="image-frame-container">
                    <div className="image-frame" onClick={() => togglePopup('jumbotron')}>
                        <img src={Jumbotron} alt="Museum Jumbotron" loading="lazy" />
                        {showPopup.jumbotron && (
                            <div className="popup show-popup">
                                <h3>The Metropolitan Museum of Art</h3>
                                <h6>New York, New York</h6>
                                <h4>The Met Facts</h4>
                                <ul>
                                    <li>Founded in 1870</li>
                                    <li>Home to over 2 million works of art</li>
                                    <li>Collection is estimated to be worth over $50 billion dollars</li>
                                    <li>Had over 3.2 million visitors in 2022</li>
                                </ul>
                                <button className="popup-close-button" onClick={(e) => togglePopup('jumbotron', e)}>Close</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Coming Soon 1 Image */}
                <div className="image-frame-container">
                    <div className="image-frame" onClick={() => togglePopup('comingSoon1')}>
                        <img src={comingsoon} alt="Coming Soon" loading="lazy" />
                        {showPopup.comingSoon1 && (
                            <div className="popup show-popup">
                                <h3>Check Back For Updates</h3>
                                <h5>Our next museum will be revealed soon!</h5>
                                <button className="popup-close-button" onClick={(e) => togglePopup('comingSoon1', e)}>Close</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Coming Soon 2 Image with lazy loading */}
                <div className="image-frame-container">
                    <div className="image-frame" onClick={() => togglePopup('comingSoon2')}>
                        <img src={comingsoon} alt="Coming Soon" loading="lazy" />
                        {showPopup.comingSoon2 && (
                            <div className="popup show-popup">
                                <h3>Check Back For Updates</h3>
                                <h5>Our next museum will be revealed soon!</h5>
                                <button className="popup-close-button" onClick={(e) => togglePopup('comingSoon2', e)}>Close</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
