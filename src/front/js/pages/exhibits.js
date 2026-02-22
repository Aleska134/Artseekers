import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import Pagination from "../component/pagination";
import AuthComponent from "../component/auth";
import "../../styles/exhibit.css";

/**
 * EXHIBITS GALLERY COMPONENT
 * Implements a responsive grid with 2 columns on mobile devices.
 */
export const Exhibits = () => {
    const { store, actions } = useContext(Context);
    const [currentPage, setCurrentPage] = useState(1);
    const artPiecesPerPage = 10;
    const fallBackURL = "https://via.placeholder.com/300x400?text=Artwork+Not+Found";

    /**
     * INITIALIZATION:
     * Fetch all artworks and departments if store is empty.
     */
    useEffect(() => {
        if (store.artPieces.length === 0) {
            actions.getArtPiecesAndDepartments();
        }
    }, []);

    // PAGINATION CALCULATION
    const indexOfLastArtPiece = currentPage * artPiecesPerPage;
    const indexOfFirstArtPiece = indexOfLastArtPiece - artPiecesPerPage;
    const currentArtPieces = store.artPieces.slice(indexOfFirstArtPiece, indexOfLastArtPiece);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0); // UX: Reset scroll to top on page change
    };

    /**
     * HELPER: Check favorite status from global store.
     */
    const isFavorited = (museumId) => {
        return store.user?.favorites?.some(fav => fav.exhibit_museum_id === museumId);
    };

    return (
        <AuthComponent>
            <div className="exhibits-container pt-5 text-center" id="background">
                <header className="mb-4">
                    <h1 className="display-4 fw-bold text-uppercase">Curated Exhibits</h1>
                    <div className="title-underline mx-auto" style={{width: "80px", height: "4px", backgroundColor: "#c5a059"}}></div>
                </header>
                
                {/* 
                    BOOTSTRAP GRID SYSTEM:
                    - row-cols-2: 2 items on mobile
                    - row-cols-md-3: 3 items on tablets
                    - row-cols-lg-4: 4 items on desktops
                */}
                <div className="container-fluid px-2 px-md-5">
                    <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-2 g-md-4 justify-content-center">
                        {currentArtPieces.length === 0 ? (
                            <div className="col-12 py-5 text-center">
                                <div className="spinner-border text-warning" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            currentArtPieces.map((item, index) => (
                                <div className="col d-flex justify-content-center" key={item.exhibit_museum_id || index}>
                                    <div className="card art-card shadow-lg">
                                        
                                        {/* ARTWORK IMAGE */}
                                        <Link to={`/exhibits/single/${item.exhibit_museum_id}`}>
                                            <img
                                                src={item.primary_image_small}
                                                className="card-img-top art-image"
                                                onError={(e) => { e.target.src = fallBackURL; }}
                                                alt={item.exhibit_name}
                                            />
                                        </Link>

                                        {/* METADATA SECTION */}
                                        <div className="card-body">
                                            <div className="card-info-top">
                                                <h6 className="card-title text-truncate">{item.exhibit_name}</h6>
                                                <p className="text-muted small mb-0">{item.department_name}</p>
                                            </div>
                                            
                                            <div className="card-footer-row">
                                                {/* Hide artist name on mobile to save space for heart icon */}
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

                <div className="py-4">
                    <Pagination
                        artPiecesPerPage={artPiecesPerPage}
                        totalArtPieces={store.artPieces.length}
                        paginate={paginate}
                        currentPage={currentPage}
                    />
                </div>
            </div>
        </AuthComponent>
    );
};