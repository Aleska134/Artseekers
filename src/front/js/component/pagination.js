import React from "react";

const Pagination = ({
  artPiecesPerPage,
  totalArtPieces,
  paginate,
  currentPage,
}) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalArtPieces / artPiecesPerPage);

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
        <li className="page-item">
          <button onClick={() => paginate(1)} className="page-link">
            First
          </button>
        </li>
        <li className="page-item">
          <button
            onClick={() => paginate(currentPage - 1)}
            className="page-link"
          >
            Previous
          </button>
        </li>
        {pageNumbers.slice(startPage - 1, endPage).map((number) => (
          <li
            key={number}
            className={`page-item${currentPage === number ? " active" : ""}`}
          >
            <button onClick={() => paginate(number)} className="page-link">
              {number}
            </button>
          </li>
        ))}
        <li className="page-item">
          <button
            onClick={() => paginate(currentPage + 1)}
            className="page-link"
          >
            Next
          </button>
        </li>
        <li className="page-item">
          <button onClick={() => paginate(totalPages)} className="page-link">
            Last
          </button>
        </li>
      </>
    );
  };

  return (
    <nav>
      <ul className="pagination">{renderPageNumbers()}</ul>
    </nav>
  );
};

export default Pagination;