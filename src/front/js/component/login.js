import React, { useContext, useState } from 'react';
import { Context } from '../store/appContext';
import { useNavigate, Link } from 'react-router-dom';
import "../../styles/login.css";

/**
 * LOGIN COMPONENT
 * Handles user authentication and session initiation.
 */
const Login = () => {
    const { actions } = useContext(Context);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' }); // Structured feedback state

    const navigate = useNavigate();

    /**
     * BUSINESS LOGIC: Login Handler
     * Validates input fields and triggers the Flux action.
     */
    const handleLogin = async (e) => {
        e.preventDefault(); // Prevents default form submission behavior (page reload)

        // 1. Basic Client-side Validation
        if (!email || !password) {
            setMessage({ type: 'danger', text: "Please enter both email and password." });
            return;
        }

        // 2. Trigger Flux action to perform the API call
        const loginSuccess = await actions.onLoginClick(email, password);

        if (loginSuccess) {
            setMessage({ type: 'success', text: "Access granted. Entering gallery..." });
            // CS Concept: Short delay before redirecting to allow user to see success message
            setTimeout(() => navigate('/profile'), 1500); 
        } else {
            setMessage({ type: 'danger', text: "Invalid credentials. Please try again." });
        }
    };

    return (
        <div className="auth-container d-flex align-items-center justify-content-center">
            <div className="auth-card shadow-lg p-4">
                <div className="text-center mb-4">
                    <h2 className="auth-title">USER LOGIN</h2>
                    <p className="text-muted small">Enter your credentials to access your collection</p>
                </div>

                {/* FEEDBACK ALERT */}
                {message.text && (
                    <div className={`alert alert-${message.type} py-2 small text-center`} role="alert">
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    {/* EMAIL FIELD */}
                    <div className="mb-3">
                        <label className="form-label small fw-bold">EMAIL ADDRESS</label>
                        <input
                            type="email"
                            className="form-control auth-input"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* PASSWORD FIELD */}
                    <div className="mb-3">
                        <label className="form-label small fw-bold">PASSWORD</label>
                        <input
                            type="password"
                            className="form-control auth-input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="text-end mb-3">
                        <span className="text-muted small" style={{cursor: "not-allowed"}}>
                            Forgot Password? (Coming Soon)
                        </span>
                    </div>

                    <button type="submit" className="btn btn-dark w-100 auth-btn">
                        SIGN IN
                    </button>
                </form>

                {/* REDIRECT TO SIGNUP */}
                <div className="text-center mt-4 border-top pt-3">
                    <p className="small mb-0">
                        New ArtSeeker? <Link to="/signup" className="auth-link">Create an account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;



















