import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import logoImage from "../../img/logo.jpg";
import { Context } from "../store/appContext";

const Navbar = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate(); // Initialize the navigation hook

    /**
     * EFFECT: State Hydration
     * Syncs user profile if token exists but user data is missing.
     */
    useEffect(() => {
        if (store.token && !store.user?.name) {
            actions.getUserProfile();
        }
    }, [store.token]);

    /**
     * HANDLER: Logout and Redirect
     * Clears session data and moves the user to the home page.
     */
    const handleLogout = () => {
        actions.logOut(); // Clear global state and sessionStorage
        navigate("/");    // Programmatic redirect to Home
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark navbar-style shadow-sm">
            <div className="container-fluid">
                {/* Brand Logo and Name */}
                <Link to="/" className="d-flex align-items-center text-decoration-none">
                    <img 
                        className="navbar-logo" 
                        src={logoImage} 
                        alt="ArtSeekers Logo" 
                        style={{ width: "40px", borderRadius: "50%" }} 
                    />
                    <span className="navbar-brand ms-2 mb-0 h1">ArtSeekers</span>
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link to="/" className="nav-link">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/museums" className="nav-link">Museums</Link>
                        </li>

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

                    <div className="d-flex align-items-center">
                        {store.token ? (
                            <div className="d-flex align-items-center">
                                <span className="text-light me-3 small d-none d-md-inline">
                                    {store.user?.name ? (
                                        <>Welcome back, <strong>{store.user.name}</strong></>
                                    ) : (
                                        <span className="text-muted italic">Loading profile...</span>
                                    )}
                                </span>
                                {/* UPDATED LOGOUT BUTTON */}
                                <button 
                                    className="btn btn-outline-danger btn-sm" 
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link to="/login">
                                <button className="btn btn-primary btn-sm">Login</button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;