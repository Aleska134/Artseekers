import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "../../styles/signup.css";

/**
 * SIGN UP COMPONENT
 * Handles new user registration with client-side validation.
 */
const SignUp = () => {
  const [profileName, setProfileName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' }); 

  const navigate = useNavigate();

  /**
   * BUSINESS LOGIC: Registration Handler
   * Validates inputs and sends POST request to the backend.
   */
  const handleSignUp = async (e) => {
    e.preventDefault(); // Prevents page reload on form submission

    // 1. Client-side Validation Logic
    if (!profileName || !username || !email || !password) {
      setMessage({ type: 'danger', text: "All fields are required." });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: 'danger', text: "Passwords do not match." });
      return;
    }

    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/sign-up`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            name: profileName, 
            username, 
            email, 
            password 
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to login after a short delay to show success message
        setMessage({ type: 'success', text: "Account created successfully! Redirecting..." });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        // Handle logic errors (e.g., user already exists)
        setMessage({ type: 'danger', text: data.message || "Registration failed." });
      }
    } catch (error) {
      console.error("Signup error:", error);
      setMessage({ type: 'danger', text: "Server error. Please try again later." });
    }
  };

  return (
    <div className="auth-container d-flex align-items-center justify-content-center">
      <div className="auth-card shadow-lg p-4">
        <div className="text-center mb-4">
            <h2 className="auth-title">CREATE ACCOUNT</h2>
            <p className="text-muted small">Join the ArtSeekers community</p>
        </div>

        {/* FEEDBACK ALERT */}
        {message.text && (
          <div className={`alert alert-${message.type} py-2 small`} role="alert">
            {message.text}
          </div>
        )}

        <form onSubmit={handleSignUp}>
          <div className="mb-3">
            <label className="form-label small fw-bold">FULL NAME</label>
            <input
              type="text"
              className="form-control auth-input"
              placeholder="e.g. Vincent Van Gogh"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold">USERNAME</label>
            <input
              type="text"
              className="form-control auth-input"
              placeholder="art_lover_99"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold">EMAIL ADDRESS</label>
            <input
              type="email"
              className="form-control auth-input"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label small fw-bold">PASSWORD</label>
                <input
                  type="password"
                  className="form-control auth-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label small fw-bold">CONFIRM</label>
                <input
                  type="password"
                  className="form-control auth-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
          </div>

          <button type="submit" className="btn btn-dark w-100 mt-3 auth-btn">
            REGISTER
          </button>
        </form>

        <div className="text-center mt-4 border-top pt-3">
          <p className="small mb-0">
            Already have an account? <Link to="/login" className="auth-link">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;