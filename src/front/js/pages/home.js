import React from "react";
import { Link } from "react-router-dom";
import "../../styles/home.css";
import background from "../../img/background.png";

export const Home = () => {
    return (
        <div className="home-wrapper" style={{ backgroundImage: `url(${background})` }}>
            <section className="hero-section text-center d-flex align-items-center justify-content-center">
                <div className="hero-content">
                    <h1 className="animate-charcter main-title">ArtSeekers</h1>
                    <p className="lead text-white px-5">Explore artworks from The Met in New York, and ask an AI curator what it sees in each piece.</p>
                    <Link to="/exhibits" className="btn btn-outline-light mt-3 me-2">Browse the Gallery</Link>
                    <a href="#about-us" className="btn btn-outline-light mt-3">How It Works</a>
                </div>
            </section>

            <div className="container mt-5 py-5 bg-white shadow-lg rounded" id="about-us">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <h2 className="text-center mb-4 section-title">How It Works</h2>
                        <div className="about-text text-secondary">
                            <p>ArtSeekers brings a selection of artworks from The Metropolitan Museum of Art (The Met) to your screen, organized by the museum's departments, from ancient Egypt to European paintings. Anyone can browse; no account needed.</p>
                            <p>Open an artwork to see who made it, when and where. Then ask the <strong>AI curator</strong>: it looks at the image itself, not only the title, and writes a few sentences about what stands out. Each analysis is saved, so the next visitor reads it right away. Like any AI, it can be wrong, so treat it as one view, not as fact.</p>
                            <p>Create a free account to save favorites to your collection and to ask the curator about pieces it has not analyzed yet.</p>
                            <p className="small">Built with <strong>React</strong>, <strong>Flask</strong> and <strong>PostgreSQL</strong>, using The Met's public collection API and Google's Gemini.</p>
                        </div>
                    </div>
                </div>

                <div className="row mt-5 text-center">
                    <div className="col-md-4 feature-item">
                        <i className="fas fa-search fa-3x mb-3 text-dark"></i>
                        <h5>Explore</h5>
                        <p className="small">Browse artworks by department, with no sign-up needed.</p>
                    </div>
                    <div className="col-md-4 feature-item">
                        <i className="fas fa-heart fa-3x mb-3 text-danger"></i>
                        <h5>Curate</h5>
                        <p className="small">Create an account to save your favorite pieces to your profile.</p>
                    </div>
                    <div className="col-md-4 feature-item">
                        <i className="fas fa-robot fa-3x mb-3 text-warning"></i>
                        <h5>Ask the Curator</h5>
                        <p className="small">An AI describes what it sees in each piece, looking at the image, not just the title.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
