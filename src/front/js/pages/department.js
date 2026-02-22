import React, { useContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import AuthComponent from "../component/auth";
import "../../styles/exhibit.css";

/**
 * DEPARTMENT VIEW COMPONENT
 * Filters and displays artworks belonging to a specific museum department.
 */
export const Department = () => {
    const { store, actions } = useContext(Context);
    const params = useParams();
    const fallBackURL = "https://via.placeholder.com/300x400?text=Artwork+Not+Found";

    /**
     * INITIALIZATION EFFECT:
     * Re-fetches data if the store is lost (e.g., on a page refresh).
     */
    useEffect(() => {
        if (store.artPieces.length === 0) {
            actions.getArtPiecesAndDepartments();
        }
    }, []);

    /**
     * DATA FILTERING LOGIC:
     * 1. Find the current department object to get its name.
     * 2. Filter the global artworks array by the department ID provided in URL params.
     */
    const department = store.artDepartments.find(
        dept => dept.department_museum_id.toString() === params.thedepartment
    );
    
    const filteredArtPieces = store.artPieces.filter(
        item => item.department_museum_id.toString() === params.thedepartment
    );

    /**
     * REACTIVE LOGIC: Check if an item is favorited.
     * This looks directly into the global user object for a Single Source of Truth.
     */
    const isFavorited = (museumId) => {
        return store.user?.favorites?.some(fav => fav.exhibit_museum_id === museumId);
    };

    return (
        <AuthComponent>
            <div className="exhibits-container pt-5 text-center" id="background">
                <header className="mb-5">
                    <span className="text-muted small letter-spacing-2">DEPARTMENT COLLECTION</span>
                    <h1 className="display-4 text-uppercase fw-bold">
                        {department ? department.name : "Loading Collection..."}
                    </h1>
                    <div className="title-underline mx-auto" style={{width: "60px", height: "3px", backgroundColor: "#c5a059"}}></div>
                </header>

                {/* 
                    CS TIP: Using Bootstrap Grid row-cols classes 
                    - row-cols-2: 2 items per row on mobile
                    - row-cols-md-3: 3 items per row on tablets
                    - row-cols-lg-4: 4 items per row on desktops
                */}
                <div className="container-fluid px-2 px-md-5">
                    <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-2 g-md-4 justify-content-center">
                        {filteredArtPieces.length === 0 ? (
                            <div className="col-12 py-5">
                                <p className="text-muted italic">No exhibits found.</p>
                            </div>
                        ) : (
                            filteredArtPieces.map((item, index) => (
                                <div className="col d-flex justify-content-center" key={item.exhibit_museum_id || index}>
                                    <div className="card art-card shadow-lg">
                                        <Link to={`/exhibits/single/${item.exhibit_museum_id}`}>
                                            <img
                                                src={item.primary_image_small}
                                                className="card-img-top art-image"
                                                onError={(e) => { e.target.src = fallBackURL; }}
                                                alt={item.exhibit_name}
                                            />
                                        </Link>

                                        <div className="card-body">
                                            <div className="card-info-top">
                                                <h6 className="card-title text-truncate">{item.exhibit_name}</h6>
                                                <p className="text-muted small mb-0">ID: #{item.exhibit_museum_id}</p>
                                            </div>
                                            
                                            <div className="card-footer-row">
                                                <small className="text-italic text-truncate d-none d-md-inline" style={{maxWidth: "70%"}}>
                                                    {item.artist_name || "Unknown"}
                                                </small>
                                                <button
                                                    className="btn btn-outline-danger border-0 p-1"
                                                    onClick={() => isFavorited(item.exhibit_museum_id) 
                                                        ? actions.deleteFavorite(item.exhibit_museum_id) 
                                                        : actions.addFavorite(item.exhibit_museum_id)}
                                                >
                                                    <i className={`${isFavorited(item.exhibit_museum_id) ? "fas" : "far"} fa-heart`}></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="mt-5 pb-5">
                    <Link to="/departments">
                        <button className="btn btn-outline-light rounded-0 px-4 py-2">
                            <i className="fas fa-th-large me-2"></i> BACK TO ALL DEPARTMENTS
                        </button>
                    </Link>
                </div>
            </div>
        </AuthComponent>
    );
};