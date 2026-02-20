import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import Pagination from "../component/pagination";
import AuthComponent from "../component/auth";
import "../../styles/exhibit.css";

export const Exhibits = () => {
    const { store, actions } = useContext(Context);
    const [currentPage, setCurrentPage] = useState(1);
    const artPiecesPerPage = 10;
    const fallBackURL = "https://via.placeholder.com/300x400?text=Artwork+Not+Found";

    /**
     * INITIALIZATION:
     * Fetch gallery data if the global store is empty on mount.
     */
    useEffect(() => {
        if (store.artPieces.length === 0) {
            actions.getArtPiecesAndDepartments();
        }
    }, []);

    /**
     * PAGINATION LOGIC:
     * Slicing the global array to show only the subset for the current page.
     */
    const indexOfLastArtPiece = currentPage * artPiecesPerPage;
    const indexOfFirstArtPiece = indexOfLastArtPiece - artPiecesPerPage;
    const currentArtPieces = store.artPieces.slice(indexOfFirstArtPiece, indexOfLastArtPiece);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0); // UX: Return to top when changing pages
    };

    /**
     * HELPER: Check if an item is in the user's favorites list.
     * Complexity: O(k) where k is the number of favorites.
     */
    const isFavorited = (museumId) => {
        return store.user?.favorites?.some(fav => fav.exhibit_museum_id === museumId);
    };

    return (
        <AuthComponent>
            <div className="exhibits-container pt-5 text-center" id="background">
                <h1 className="display-4 mb-5">CURATED EXHIBITS</h1>
                
                <div className="d-flex flex-wrap justify-content-center w-100" id="main">
                    {currentArtPieces.length === 0 ? (
                        <div className="spinner-border text-warning" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    ) : (
                        currentArtPieces.map((item, index) => (
                            <div className="rowExhibit m-3" key={item.exhibit_museum_id || index}>
                                <div className="card art-card">
                                    {/* ARTWORK IMAGE */}
                                    <Link to={`/exhibits/single/${item.exhibit_museum_id}`}>
                                        <img
                                            src={item.primary_image_small}
                                            className="card-img-top art-image"
                                            onError={(e) => { e.target.src = fallBackURL; }}
                                            alt={item.exhibit_name}
                                        />
                                    </Link>

                                    {/* DATA SECTION: Flexbox container */}
                                    <div className="card-body">
                                        <div className="card-info-top">
                                            <h6 className="card-title">{item.exhibit_name}</h6>
                                            <p className="text-muted small">{item.department_name}</p>
                                        </div>
                                        
                                        {/* STICKY FOOTER: Artist and Favorite Toggle */}
                                        <div className="card-footer-row">
                                            <small className="text-italic text-truncate" style={{maxWidth: "75%"}}>
                                                {item.artist_name || "Unknown Author"}
                                            </small>
                                            <button
                                                className="btn btn-outline-danger btn-sm border-0"
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

                <Pagination
                    artPiecesPerPage={artPiecesPerPage}
                    totalArtPieces={store.artPieces.length}
                    paginate={paginate}
                    currentPage={currentPage}
                />
            </div>
        </AuthComponent>
    );
};