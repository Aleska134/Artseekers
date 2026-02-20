import React from "react";
import "../../styles/home.css"; // Ensure this contains the footer styles or use global styles

/**
 * FOOTER COMPONENT
 * Minimalist design for a professional portfolio.
 * Highlights the developer and the tech stack.
 */
export const Footer = () => (
	<footer className="footer-style mt-auto py-4 text-center">
		<p className="mb-1 text-light">
			Built with <i className="fa fa-heart text-danger pulse" /> by{" "}
			<span className="gold-text">Aleska P Braschi</span> | ArtSeekers Engine
		</p>
		<p className="small text-muted">
			© 2026 All Rights Reserved | Developed with React & Flask
		</p>
		
		
		<div className="mt-2">
			<a href="https://github.com/Aleska134/Artseekers" target="_blank" rel="noopener noreferrer" className="footer-link">
				<i className="fab fa-github me-2"></i> Source Code
			</a>
			<span className="mx-2 text-muted">|</span>
			<a href="https://linkedin.com/in/aleska-p-braschi" target="_blank" rel="noopener noreferrer" className="footer-link">
				<i className="fab fa-linkedin me-2"></i> Professional Profile
			</a>
		</div>
	</footer>
);