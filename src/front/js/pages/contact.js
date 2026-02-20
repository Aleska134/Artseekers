import React, { useContext, useState, useRef } from "react";
import { Context } from "../store/appContext";
import emailjs from "@emailjs/browser";
import "../../styles/contact.css";

/**
 * CONTACT US COMPONENT
 * Handles external communication via EmailJS.
 * Demonstrates: Third-party API integration, Form Validation, and Ref usage.
 */
export const Contactus = () => {
    const form = useRef();
    const { store, actions } = useContext(Context);
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    // UI state for feedback
    const [status, setStatus] = useState({ type: '', text: '' });
    const [isSending, setIsSending] = useState(false);

    /**
     * CS LOGIC: Client-side Validation
     * Ensures all fields meet minimum requirements before hitting the API.
     */
    const validateForm = () => {
        const { name, email, subject, message } = formData;
        return (
            name.length > 2 && 
            email.includes("@") && 
            subject.length > 2 && 
            message.length > 5
        );
    };

    /**
     * EVENT HANDLER: Form Submission
     * Uses EmailJS to send data to the configured service.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            setStatus({ type: 'danger', text: "Please fill out all fields correctly." });
            return;
        }

        setIsSending(true);
        setStatus({ type: 'info', text: "Sending your message..." });

        try {
            // Integrating EmailJS Service
            const result = await emailjs.sendForm(
                "service_m002m7i", 
                "template_rpim9xk", 
                form.current, 
                "zDvFQ-YKrOe7WmY8U"
            );

            if (result.text === "OK") {
                setStatus({ type: 'success', text: "Message sent! We will contact you soon." });
                // Reset form on success
                setFormData({ name: '', email: '', subject: '', message: '' });
            }
        } catch (error) {
            console.error("EmailJS Error:", error);
            setStatus({ type: 'danger', text: "Failed to send message. Please try again later." });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="contact-page-wrapper auth-container d-flex align-items-center justify-content-center py-5">
            <div className="auth-card shadow-lg p-4" style={{maxWidth: "800px"}}>
                <header className="text-center mb-4">
                    <h2 className="auth-title">CONTACT US</h2>
                    <p className="text-muted small">Have questions? Our curators are here to help.</p>
                </header>

                {/* FEEDBACK SYSTEM */}
                {status.text && (
                    <div className={`alert alert-${status.type} py-2 small text-center`} role="alert">
                        {status.text}
                    </div>
                )}

                <div className="row mt-4">
                    {/* FORM SECTION */}
                    <div className="col-md-8 border-end">
                        <form ref={form} onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label small fw-bold">NAME</label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        className="form-control auth-input" 
                                        value={formData.name} 
                                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                        required 
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label small fw-bold">EMAIL</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        className="form-control auth-input" 
                                        value={formData.email} 
                                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                        required 
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">SUBJECT</label>
                                <input 
                                    type="text" 
                                    name="subject" 
                                    className="form-control auth-input" 
                                    value={formData.subject} 
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})} 
                                    required 
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">MESSAGE</label>
                                <textarea 
                                    name="message" 
                                    rows="4" 
                                    className="form-control auth-input" 
                                    value={formData.message} 
                                    onChange={(e) => setFormData({...formData, message: e.target.value})} 
                                    required
                                ></textarea>
                            </div>
                            <button 
                                type="submit" 
                                className="btn btn-dark auth-btn w-100" 
                                disabled={isSending}
                            >
                                {isSending ? "SENDING..." : "SEND MESSAGE"}
                            </button>
                        </form>
                    </div>

                    {/* INFO SECTION */}
                    <div className="col-md-4 text-center d-flex flex-column justify-content-center">
                        <div className="mb-4">
                            <i className="fas fa-map-marker-alt fa-2x text-warning mb-2"></i>
                            <p className="small mb-0">Miami, FL USA</p>
                        </div>
                        <div className="mb-4">
                            <i className="fas fa-phone text-warning mb-2"></i>
                            <p className="small mb-0">012-345-6789</p>
                        </div>
                        <div className="">
                            <i className="fas fa-envelope text-warning mb-2"></i>
                            <p className="small mb-0">team@artseekers.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};