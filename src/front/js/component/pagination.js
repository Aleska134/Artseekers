// import React from "react";

// const Pagination = ({
//   artPiecesPerPage,
//   totalArtPieces,
//   paginate,
//   currentPage,
// }) => {
//   const pageNumbers = [];
//   const totalPages = Math.ceil(totalArtPieces / artPiecesPerPage);

//   for (let i = 1; i <= totalPages; i++) {
//     pageNumbers.push(i);
//   }

//   const renderPageNumbers = () => {
//     const maxPagesToShow = 3;
//     let startPage, endPage;

//     if (totalPages <= maxPagesToShow) {
//       startPage = 1;
//       endPage = totalPages;
//     } else {
//       if (currentPage <= Math.ceil(maxPagesToShow / 2)) {
//         startPage = 1;
//         endPage = maxPagesToShow;
//       } else if (currentPage + Math.floor(maxPagesToShow / 2) >= totalPages) {
//         startPage = totalPages - maxPagesToShow + 1;
//         endPage = totalPages;
//       } else {
//         startPage = currentPage - Math.floor(maxPagesToShow / 2);
//         endPage = currentPage + Math.ceil(maxPagesToShow / 2) - 1;
//       }
//     }

//     return (
//       <>
//         <li className="page-item">
//           <button onClick={() => paginate(1)} className="page-link">
//             First
//           </button>
//         </li>
//         <li className="page-item">
//           <button
//             onClick={() => paginate(currentPage - 1)}
//             className="page-link"
//           >
//             Previous
//           </button>
//         </li>
//         {pageNumbers.slice(startPage - 1, endPage).map((number) => (
//           <li
//             key={number}
//             className={`page-item${currentPage === number ? " active" : ""}`}
//           >
//             <button onClick={() => paginate(number)} className="page-link">
//               {number}
//             </button>
//           </li>
//         ))}
//         <li className="page-item">
//           <button
//             onClick={() => paginate(currentPage + 1)}
//             className="page-link"
//           >
//             Next
//           </button>
//         </li>
//         <li className="page-item">
//           <button onClick={() => paginate(totalPages)} className="page-link">
//             Last
//           </button>
//         </li>
//       </>
//     );
//   };

//   return (
//     <nav>
//       <ul className="pagination">{renderPageNumbers()}</ul>
//     </nav>
//   );
// };

// export default Pagination;
import React from "react";
import PropTypes from "prop-types"; // Best practice: typing your props

const Pagination = ({
  artPiecesPerPage,
  totalArtPieces,
  paginate,
  currentPage,
}) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalArtPieces / artPiecesPerPage);

  // CS Concept: Algorithm to generate page numbers array
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  /**
   * Helper function to render the numeric page buttons.
   * Implements a "sliding window" logic to only show a subset of pages.
   */
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
          <button 
            onClick={() => paginate(1)} 
            className="page-link bg-dark text-white border-secondary"
            disabled={currentPage === 1}
          >
            &laquo; First
          </button>
        </li>

        {/* PREVIOUS PAGE */}
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            onClick={() => paginate(currentPage - 1)}
            className="page-link bg-dark text-white border-secondary"
            disabled={currentPage === 1}
          >
            Prev
          </button>
        </li>

        {/* NUMERIC PAGES */}
        {pageNumbers.slice(startPage - 1, endPage).map((number) => (
          <li
            key={number}
            className={`page-item ${currentPage === number ? "active" : ""}`}
          >
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
          <button
            onClick={() => paginate(currentPage + 1)}
            className="page-link bg-dark text-white border-secondary"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </li>

        {/* LAST PAGE */}
        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
          <button 
            onClick={() => paginate(totalPages)} 
            className="page-link bg-dark text-white border-secondary"
            disabled={currentPage === totalPages}
          >
            Last &raquo;
          </button>
        </li>
      </>
    );
  };

  // Do not render anything if there is only one page or no items
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Artwork gallery navigation" className="d-flex justify-content-center mt-4">
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