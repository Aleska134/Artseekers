import React from "react";
import "../../styles/home.css";
import background from "../../img/background.png";

export const Home = () => {
    return (
        <div className="home-wrapper" style={{ backgroundImage: `url(${background})` }}>
            <section className="hero-section text-center d-flex align-items-center justify-content-center">
                <div className="hero-content">
                    <h1 className="animate-charcter main-title">ArtSeekers</h1>
                    <p className="lead text-white px-5">Your digital sanctuary for world-class masterpieces.</p>
                    <a href="#about-us" className="btn btn-outline-light mt-3">Discover Our Mission</a>
                </div>
            </section>

            <div className="container mt-5 py-5 bg-white shadow-lg rounded" id="about-us">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <h2 className="text-center mb-4 section-title">About the Project</h2>
                        <div className="about-text text-secondary">
                            <p>ArtSeekers is more than a gallery; it's a high-performance engine for art exploration. Leveraging the MET Museum API, our platform allows enthusiasts to discover, curate, and analyze history's finest works.</p>
                            <p>Built with <strong>React.js</strong> and <strong>Flask</strong>, this platform demonstrates the power of modern web architecture combined with historical preservation.</p>
                        </div>
                    </div>
                </div>

                <div className="row mt-5 text-center">
                    <div className="col-md-4 feature-item">
                        <i className="fas fa-search fa-3x mb-3 text-dark"></i>
                        <h5>Explore</h5>
                        <p className="small">Access thousands of pieces from specialized MET departments.</p>
                    </div>
                    <div className="col-md-4 feature-item">
                        <i className="fas fa-heart fa-3x mb-3 text-danger"></i>
                        <h5>Curate</h5>
                        <p className="small">Save your favorite masterpieces to your personal profile.</p>
                    </div>
                    <div className="col-md-4 feature-item">
                        <i className="fas fa-bolt fa-3x mb-3 text-warning"></i>
                        <h5>Fast API</h5>
                        <p className="small">Optimized data delivery using Hash Map structures.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
