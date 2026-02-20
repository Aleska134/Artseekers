import React, { useContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/single.css";

/**
 * SINGLE PAGE COMPONENT
 * Displays detailed information about a specific artwork.
 */
export const Single = () => {
    const { store, actions } = useContext(Context);
    const params = useParams();

    /**
     * INITIALIZATION EFFECT:
     * Ensures data is loaded if the user lands directly on this page 
     * or performs a hard refresh.
     */
    useEffect(() => {
        // Fetch artworks and departments if store is empty
        if (store.artPieces.length === 0) {
            actions.getArtPiecesAndDepartments();
        }
        // Fetch user profile to sync favorites list
        if (store.token && !store.user?.name) {
            actions.getUserProfile();
        }
    }, [store.token]);

    /**
     * DATA RETRIEVAL:
     * Find the specific exhibit object in the store array matching the URL ID.
     * Complexity: O(N) where N is the number of art pieces.
     */
    const exhibit = store.artPieces.find(
        (item) => item.exhibit_museum_id == params.objectID
    );

    /**
     * LOADING STATE:
     * Prevents the application from crashing if the data is not yet available.
     */
    if (!exhibit) {
        return (
            <div id="single-background" className="text-center pt-5">
                <div className="spinner-border text-warning" role="status">
                    <span className="visually-hidden">Loading Artwork Details...</span>
                </div>
            </div>
        );
    }

    /**
     * BUSINESS LOGIC: Dynamic Favorite Status
     * Checks if this specific artwork ID exists within the user's favorites array.
     */
    const isAlreadyFavorite = store.user?.favorites?.some(
        (fav) => fav.exhibit_museum_id == params.objectID
    );

    /**
     * HANDLER: Toggle Favorite
     * Decides whether to add or remove based on current favorite status.
     */
    const handleFavoriteToggle = () => {
        if (isAlreadyFavorite) {
            actions.deleteFavorite(exhibit.exhibit_museum_id);
        } else {
            actions.addFavorite(exhibit.exhibit_museum_id);
        }
    };

    return (
        <div id="single-background">
            <div className="container mt-5">
                <div className="row justify-content-center">
                    
                    {/* LEFT COLUMN: VISUAL DISPLAY (THE POSTER) */}
                    <div className="col-lg-6 mb-4">
                        <div className="art-poster-container">
                            <img
                                src={exhibit.primary_image_small}
                                className="art-poster-img shadow-lg"
                                alt={exhibit.exhibit_name}
                                onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/600x800?text=Artwork+Image+Not+Available";
                                }}
                            />
                        </div>
                    </div>

                    {/* RIGHT COLUMN: TECHNICAL METADATA (THE MUSEUM LABEL) */}
                    <div className="col-lg-5">
                        <div className="details-section shadow-sm">
                            <h1 className="singlecard-title">{exhibit.exhibit_name}</h1>
                            <p className="artist-sub text-muted">Created by {exhibit.artist_name || "Unknown Artist"}</p>

                            <div className="metadata-container mt-4">
                                <span className="metadata-label">Historical Culture</span>
                                <span className="metadata-value">{exhibit.culture || "Not documented"}</span>

                                <span className="metadata-label">Geographic Region</span>
                                <span className="metadata-value">{exhibit.region || "Not documented"}</span>

                                <span className="metadata-label">Approximate Date</span>
                                <span className="metadata-value">{exhibit.object_date || "Unknown"}</span>
                                
                                <span className="metadata-label">Museum Database Reference</span>
                                <span className="metadata-value">Ref. #{exhibit.exhibit_museum_id}</span>
                            </div>

                            {/* ACTION BUTTONS */}
                            <div className="d-flex flex-column gap-2 mt-5">
                                
                                {/* DYNAMIC BUTTON: Changes color, icon, and label based on favorite state */}
                                <button 
                                    className={`btn ${isAlreadyFavorite ? "btn-danger" : "btn-outline-danger"} w-100 py-2`}
                                    onClick={handleFavoriteToggle}
                                >
                                    <i className={`${isAlreadyFavorite ? "fas" : "far"} fa-heart me-2`}></i>
                                    {isAlreadyFavorite ? "Remove from Collection" : "Add to Private Collection"}
                                </button>

                                <Link to="/exhibits">
                                    <button className="btn back-btn w-100 py-2">
                                        <i className="fas fa-arrow-left me-2"></i> Return to Gallery
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};