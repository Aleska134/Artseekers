import React from "react";
import PropTypes from "prop-types";

/**
 * PAGINATION COMPONENT
 * Handles page navigation logic with a sliding window approach.
 */
const Pagination = ({ artPiecesPerPage, totalArtPieces, paginate, currentPage }) => {
    const pageNumbers = [];
    const totalPages = Math.ceil(totalArtPieces / artPiecesPerPage);

    // Generate the array of available pages
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const renderPageNumbers = () => {
        const maxPagesToShow = 3;
        let startPage, endPage;

        if (totalPages <= maxPagesToShow) {
            startPage = 1;
            endPage = totalPages;
        } else {
            if (currentPage <= Math.ceil(maxPagesToShow / 2)) {
                startPage = 1;
                endPage = maxPagesToShow;
            } else if (currentPage + Math.floor(maxPagesToShow / 2) >= totalPages) {
                startPage = totalPages - maxPagesToShow + 1;
                endPage = totalPages;
            } else {
                startPage = currentPage - Math.floor(maxPagesToShow / 2);
                endPage = currentPage + Math.ceil(maxPagesToShow / 2) - 1;
            }
        }

        return (
            <>
                {/* FIRST PAGE */}
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button onClick={() => paginate(1)} className="page-link bg-dark text-white border-secondary">
                        <span className="d-none d-md-inline">First</span>
                        <span className="d-md-none">&laquo;</span>
                    </button>
                </li>

                {/* PREVIOUS PAGE */}
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button onClick={() => paginate(currentPage - 1)} className="page-link bg-dark text-white border-secondary">
                        <span className="d-none d-md-inline">Prev</span>
                        <span className="d-md-none">&lsaquo;</span>
                    </button>
                </li>

                {/* NUMERIC PAGES */}
                {pageNumbers.slice(startPage - 1, endPage).map((number) => (
                    <li key={number} className={`page-item ${currentPage === number ? "active" : ""}`}>
                        <button 
                            onClick={() => paginate(number)} 
                            className={`page-link border-secondary ${currentPage === number ? "bg-primary border-primary" : "bg-dark text-white"}`}
                        >
                            {number}
                        </button>
                    </li>
                ))}

                {/* NEXT PAGE */}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button onClick={() => paginate(currentPage + 1)} className="page-link bg-dark text-white border-secondary">
                        <span className="d-none d-md-inline">Next</span>
                        <span className="d-md-none">&rsaquo;</span>
                    </button>
                </li>

                {/* LAST PAGE */}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button onClick={() => paginate(totalPages)} className="page-link bg-dark text-white border-secondary">
                        <span className="d-none d-md-inline">Last</span>
                        <span className="d-md-none">&raquo;</span>
                    </button>
                </li>
            </>
        );
    };

    if (totalPages <= 1) return null;

    return (
        <nav aria-label="Gallery navigation" className="d-flex justify-content-center mt-4">
            <ul className="pagination shadow-sm">
                {renderPageNumbers()}
            </ul>
        </nav>
    );
};

Pagination.propTypes = {
    artPiecesPerPage: PropTypes.number.isRequired,
    totalArtPieces: PropTypes.number.isRequired,
    paginate: PropTypes.func.isRequired,
    currentPage: PropTypes.number.isRequired,
};

export default Pagination;