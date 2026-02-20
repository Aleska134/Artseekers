import React from "react";

/**
 * TECHNICAL COMPONENT: BackendURL
 * This renders an error state if the BACKEND_URL environment variable is missing.
 * Prevents the application from running in an unstable configuration.
 */
const Dark = ({children}) => <span className="bg-dark text-warning px-2 py-1 rounded font-monospace">{children}</span>;

export const BackendURL = () => (
	<div className="container-fluid d-flex align-items-center justify-content-center" style={{ minHeight: "100vh", backgroundColor: "#121212", color: "white" }}>
		<div className="p-5 shadow-lg border border-secondary text-center" style={{ maxWidth: "700px", backgroundColor: "#1a1a1a" }}>
			<h2 className="text-warning mb-4">
                <i className="fas fa-server me-3"></i>
                Environment Configuration Required
            </h2>
			
            <p className="lead">The application detected a missing <Dark>BACKEND_URL</Dark> variable.</p>
            
            <div className="text-start p-4 mt-4" style={{ backgroundColor: "#000", borderLeft: "4px solid #c5a059" }}>
                <p className="small text-muted mb-3">// SYSTEM RECOVERY STEPS:</p>
                <ol className="small" style={{ lineHeight: "1.8" }}>
                    <li>Locate your <Dark>.env</Dark> file in the project root.</li>
                    <li>Ensure the following line is present:</li>
                    <li className="list-unstyled mt-2 ms-3">
                        <code>BACKEND_URL=https://your-api-3001.app.github.dev</code>
                    </li>
                    <li className="mt-2">Verify that the Backend server is running on port <strong>3001</strong>.</li>
                    <li>Restart the Webpack development server (<Dark>npm start</Dark>).</li>
                </ol>
            </div>

            <div className="mt-5 pt-3 border-top border-secondary">
                <p className="small text-muted mb-0">ArtSeekers Engine | Internal Diagnostics</p>
            </div>
		</div>
	</div>
);
