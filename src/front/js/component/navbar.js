import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import logoImage from "../../img/logo.jpg";
import { Context } from "../store/appContext";

/**
 * NAVBAR COMPONENT
 * Handles navigation and global authentication state display.
 */
const Navbar = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    /**
     * EFFECT: Profile Synchronization
     * Fetches user data if a token exists but the profile object is empty.
     */
    useEffect(() => {
        if (store.token && !store.user?.name) {
            actions.getUserProfile();
        }
    }, [store.token]);

    /**
     * HANDLER: Session Termination
     * Logs the user out and redirects to the landing page.
     */
    const handleLogout = () => {
        actions.logOut();
        navigate("/");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark navbar-style shadow-sm">
            <div className="container-fluid">
                {/* Branding and Logo */}
                <Link to="/" className="d-flex align-items-center text-decoration-none">
                    <img 
                        className="navbar-logo" 
                        src={logoImage} 
                        alt="ArtSeekers Logo" 
                        style={{ width: "40px", borderRadius: "50%" }} 
                    />
                    <span className="navbar-brand ms-2 mb-0 h1">ArtSeekers</span>
                </Link>

                {/* 
                    UPDATED RESPONSIVE TOGGLER
                    Replaced default SVG with FontAwesome for better styling control.
                */}
                <button
                    className="navbar-toggler border-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    {/* CS Logic: Using an icon font allows us to style it as text (CSS 'color') */}
                    <i className="fas fa-bars" style={{ color: "#c5a059", fontSize: "1.5rem" }}></i>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link to="/" className="nav-link">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/museums" className="nav-link">Museums</Link>
                        </li>

                        {/* PROTECTED NAVIGATION LINKS */}
                        {store.token && (
                            <>
                                <li className="nav-item">
                                    <Link to="/exhibits" className="nav-link">Exhibits</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/departments" className="nav-link">Departments</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/profile" className="nav-link">
                                        <i className="fas fa-user-circle me-1"></i> Profile
                                    </Link>
                                </li>
                            </>
                        )}

                        <li className="nav-item">
                            <Link to="/contact" className="nav-link">Contact Us</Link>
                        </li>
                    </ul>

                    {/* AUTHENTICATION ACTION AREA */}
                    <div className="d-flex align-items-center">
                        {store.token ? ( 
                            <div className="d-flex align-items-center ms-auto">
                                <span className="text-light me-3 d-none d-lg-inline small italic">
                                    {store.user?.name ? `Welcome, ${store.user.name}` : "Loading..."}
                                </span>
                           
                                <button 
                                    className="btn btn-outline-danger btn-sm" 
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link to="/login">
                                <button className="btn btn-primary btn-sm px-3">Login</button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;