import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/single.css";

/**
 * SINGLE COMPONENT
 * Displays full details of an artwork and integrates Multimodal AI (Vision).
 */
export const Single = () => {
    const { store, actions } = useContext(Context);
    const params = useParams();
    
    // UI State for AI features
    const [aiLoading, setAiLoading] = useState(false);
    const [aiInsight, setAiInsight] = useState(null);

    /**
     * EFFECT: Initial Data Sync
     * Hydrates the store with artworks and user profile if missing.
     */
    useEffect(() => {
        if (store.artPieces.length === 0) actions.getArtPiecesAndDepartments();
        if (store.token && !store.user?.name) actions.getUserProfile();
    }, [store.token]);

    /**
     * DATA RETRIEVAL:
     * We find the specific artwork object from the global store using the URL ID.
     */
    const exhibit = store.artPieces.find(item => item.exhibit_museum_id == params.objectID);

    /**
     * HANDLER: Ask the AI Curator
     * Sends the text metadata AND the image URL to the Multimodal LLM.
     */
    const handleAIAsk = async () => {
        if (!exhibit) return;

        setAiLoading(true);
        // CS Logic: We pass the image URL so the model can perform "Vision Analysis"
        const insight = await actions.getAIInsight({
            name: exhibit.exhibit_name,
            artist: exhibit.artist_name,
            culture: exhibit.culture,
            image_url: exhibit.primary_image_small 
        });
        setAiInsight(insight);
        setAiLoading(false);
    };

    /**
     * LOADING GUARD:
     * Returns a spinner if the 'exhibit' object hasn't been found in the store yet.
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

    // Check if the user has already favorited this item
    const isAlreadyFavorite = store.user?.favorites?.some(fav => fav.exhibit_museum_id == params.objectID);

    return (
        <div id="single-background">
            <div className="container mt-5">
                <div className="row justify-content-center">
                    
                    {/* ARTWORK FRAME */}
                    <div className="col-lg-6 mb-4">
                        <div className="art-poster-container">
                            <img 
                                src={exhibit.primary_image_small} 
                                className="art-poster-img shadow-lg" 
                                alt={exhibit.exhibit_name} 
                            />
                        </div>
                    </div>

                    {/* TECHNICAL DATA PANEL */}
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
                            </div>

                            {/* AI MULTIMODAL SECTION */}
                            <div className="ai-section mt-5 p-3 rounded" style={{ backgroundColor: "rgba(197, 160, 89, 0.1)", border: "1px solid #c5a059" }}>
                                <h6 className="text-warning mb-2"><i className="fas fa-robot me-2"></i> AI VIRTUAL CURATOR (Qwen-Vision)</h6>
                                {!aiInsight ? (
                                    <button 
                                        className="btn btn-sm btn-warning w-100 fw-bold" 
                                        onClick={handleAIAsk} 
                                        disabled={aiLoading}
                                    >
                                        {aiLoading ? (
                                            <><span className="spinner-border spinner-border-sm me-2"></span>Analyzing Image...</>
                                        ) : (
                                            "Analyze Artwork with AI"
                                        )}
                                    </button>
                                ) : (
                                    <p className="small italic text-light animate__animated animate__fadeIn">
                                        "{aiInsight}"
                                    </p>
                                )}
                            </div>

                            {/* USER ACTIONS */}
                            <div className="d-flex flex-column gap-2 mt-4">
                                <button 
                                    className={`btn ${isAlreadyFavorite ? "btn-danger" : "btn-outline-danger"} w-100 py-2`} 
                                    onClick={() => isAlreadyFavorite ? actions.deleteFavorite(exhibit.exhibit_museum_id) : actions.addFavorite(exhibit.exhibit_museum_id)}
                                >
                                    <i className={`${isAlreadyFavorite ? "fas" : "far"} fa-heart me-2`}></i>
                                    {isAlreadyFavorite ? "Remove from Collection" : "Add to Collection"}
                                </button>

                                <Link to="/exhibits">
                                    <button className="btn back-btn w-100 py-2"><i className="fas fa-arrow-left me-2"></i> Return to Gallery</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};