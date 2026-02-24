import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import AuthComponent from "../component/auth";
import "../../styles/departments.css";

/**
 * DEPARTMENTS PAGE
 * Displays a list of all MET Museum departments fetched from the backend.
 */
export const Departments = () => {
    const { store, actions } = useContext(Context);

    /**
     * INITIALIZATION:
     * Fetch departments only if the store is currently empty.
     * Optimization: Prevents redundant API calls if data was already loaded.
     */
    useEffect(() => {
        if (store.artDepartments.length === 0) {
            actions.getArtPiecesAndDepartments();
        }
    }, []);

    return (
        <AuthComponent>
            <div className="departments-wrapper" id="background">
                <div className="container py-5">
                    <header className="text-center mb-5">
                        <h1 className="display-3 section-title">MUSEUM DEPARTMENTS</h1>
                        <p className="lead text-muted">Select a specialized collection to explore curated masterpieces.</p>
                        <div className="title-underline"></div>
                    </header>

                    {/* DEPARTMENTS GRID */}
                    <div className="row g-4 justify-content-center">
                        {store.artDepartments.length === 0 ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-warning" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            store.artDepartments.map((dept) => (
                                <div key={dept.department_museum_id} className="col-md-6 col-lg-4">
                                    <Link 
                                        to={`/department/${dept.department_museum_id}`} 
                                        className="text-decoration-none"
                                    >
                                        <div className="dept-card">
                                            <div className="dept-card-overlay"></div>
                                            <div className="dept-content">
                                                <span className="dept-id">Collection #{dept.department_museum_id}</span>
                                                <h3 className="dept-name">{dept.name}</h3>
                                                <div className="explore-link">
                                                    View Exhibits <i className="fas fa-arrow-right ms-2"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AuthComponent>
    );
};