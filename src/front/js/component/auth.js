import React, { useContext, useEffect } from 'react';
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';

/**
 * AUTH COMPONENT (Route Guard)
 * Protects children components from unauthorized access.
 * Redirects to /login if no valid session token is found.
 */
const AuthComponent = ({ children }) => {
    const { store } = useContext(Context);
    const navigate = useNavigate();

    /**
     * EFFECT: Authentication Check
     * This effect runs whenever the token state changes.
     */
    useEffect(() => {
        // If the store has finished initialization and there is NO token
        if (!store.token && sessionStorage.getItem("token") === null) {
            console.warn("Unauthorized access detected. Redirecting to login...");
            navigate('/login');
        }
    }, [store.token, navigate]);

    // If token exists, render the protected content
    if (store.token) {
        return <>{children}</>;
    }

    // While checking or redirecting, show a clean loading state to avoid UI flickering
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh", backgroundColor: "#121212" }}>
            <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Authenticating...</span>
            </div>
        </div>
    );
};

export default AuthComponent;