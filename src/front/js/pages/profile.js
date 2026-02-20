// import React, { useContext, useEffect } from "react";
// import { Context } from "../store/appContext";
// import { Link } from "react-router-dom";
// import "../../styles/home.css";
// import "../../styles/profile.css";

// export const Profile = () => {
//   const { store, actions } = useContext(Context);
//   useEffect(() => {
//     actions.usersFavoritePage();
//   }, []);
//   const handleDeleteFavorite = (exhibit_museum_id) => {
//     actions.deleteFavorite(exhibit_museum_id);
//     actions.usersFavoritePage();
//     console.log(store.user);
//   };
//   return (
//     <div className="text-center mb-0" id="background-color">
//       <section className="h-100 gradient-custom-2">
//         <div className="container py-5 h-100">
//           <div className="row d-flex justify-content-center align-items-center h-100">
//             <div className="col col-lg-12 col-xl-12">
//               <div className="profile-card">
//                 <div
//                   className="rounded-top text-white d-flex flex-row"
//                   style={{ backgroundColor: "#000", height: "200px" }}
//                 >
//                   <div
//                     className="ms-4 mt-5 d-flex flex-column"
//                     style={{ width: "150px" }}
//                   >
//                     <img
//                       src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
//                       alt="Generic placeholder image"
//                       className="img-fluid img-thumbnail mt-4 mb-2"
//                       style={{ width: "150px", zIndex: "1" }}
//                     />
//                     <button
//                       type="button"
//                       className="btn btn-outline-dark w-100"
//                       data-mdb-ripple-color="dark"
//                       style={{
//                         zIndex: "1",
//                         marginTop: "-21px",
//                         marginLeft: "155px",
//                       }}
//                     >
//                       Edit profile
//                     </button>
//                   </div>
//                   <div className="ms-3" style={{ marginTop: "130px" }}>
//                     <h5>{store.user?.name}</h5>
//                     <p className="text-start fw-lighter">
//                       {store.user?.username}
//                     </p>
//                   </div>
//                 </div>
//                 <div
//                   className="p-4 text-black"
//                   style={{ backgroundColor: "#F8F9FA" }}
//                 >
//                   <div className="d-flex justify-content-end text-center py-1"></div>
//                 </div>
//                 <div className="card-body p-4 text-black flex-column">
//                   <div className="d-flex justify-content-between align-items-center mb-4">
//                     <p className="lead fw-normal mb-0 text-decoration-underline">
//                       FAVORITES
//                     </p>
//                   </div>
//                   <div className="row">
//                     {store.user?.favorites?.map((item, index) => (
//                       <div
//                         key={index}
//                         className="col-md-4 mb-4" // Adjust this according to your needs
//                       >
//                         <div
//                           className="card"
//                           style={{
//                             width: "100%", // Adjust according to your needs
//                             height: "auto",
//                             boxShadow: "10px 10px 20px 21px rgba(0, 0, 0, 0.2)",
//                             border: "15px solid black",
//                           }}
//                         >
//                           <Link
//                             to={`../exhibits/single/${item.exhibit_museum_id}`}
//                           >
//                             <img
//                               src={item.primary_image_small}
//                               alt="image 1"
//                               className="w-50 rounded-3"
//                               style={{marginTop: "15px",
//                                       border: "2px solid black",
//                                       height: "250px"
//                                     }}
//                             />
//                           </Link>

//                           <div className="profile-col card-body overflow-auto mb-2">
//                             <p style={{fontSize:"20px"}}>{item.exhibit_name}</p>&nbsp;&nbsp;&nbsp;
//                             <button
//                               // style={{float: "right"}}
//                               className="profileButton"
//                               id="trashprofileButton"
//                               onClick={() =>
//                                 handleDeleteFavorite(item.exhibit_museum_id)
//                               }
//                             >
//                               <i
//                                 className="fas fa-trash text-center "
//                                 aria-hidden="true"
//                                 // style={{"height": "5px"}}
//                                 id= "texttrash"
//                               ></i>
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };
import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/profile.css";

export const Profile = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.getUserProfile();
    }, []);

    const handleDeleteFavorite = (exhibit_museum_id) => {
        actions.deleteFavorite(exhibit_museum_id);
    };

    return (
        <div className="profile-page-container">
            <section className="gradient-custom-2">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12">
                            <div className="profile-card shadow-lg">
                                {/* Profile Header Section */}
                                <div className="rounded-top text-white d-flex flex-row" style={{ backgroundColor: "#000", height: "200px" }}>
                                    <div className="ms-4 mt-5 d-flex flex-column" style={{ width: "150px" }}>
                                        <img
                                            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                                            alt="Profile Placeholder"
                                            className="img-fluid img-thumbnail mt-4 mb-2"
                                            style={{ width: "150px", zIndex: "1" }}
                                        />
                                        <button type="button" className="btn btn-outline-dark btn-sm mt-1" style={{ zIndex: "1" }}>
                                            Edit profile
                                        </button>
                                    </div>
                                    <div className="ms-3" style={{ marginTop: "130px" }}>
                                        <h4 className="text-uppercase">{store.user?.name || "Art Seeker"}</h4>
                                        <p className="fw-light">@{store.user?.username}</p>
                                    </div>
                                </div>

                                {/* Stats Bar */}
                                <div className="p-4 text-black" style={{ backgroundColor: "#F8F9FA" }}>
                                    <div className="d-flex justify-content-end text-center py-1">
                                        <div className="px-3">
                                            <p className="mb-1 h5">{store.user?.favorites?.length || 0}</p>
                                            <p className="small text-muted mb-0">Saved Masterpieces</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Favorites Grid */}
                                <div className="card-body p-4 text-black">
                                    <div className="d-flex justify-content-between align-items-center mb-4 border-bottom">
                                        <p className="lead fw-normal mb-1">YOUR PRIVATE COLLECTION</p>
                                    </div>
                                    
                                    <div className="row">
                                        {store.user?.favorites && store.user.favorites.length > 0 ? (
                                            store.user.favorites.map((item, index) => (
                                                <div key={item.exhibit_museum_id || index} className="col-lg-4 col-md-6 mb-4">
                                                    <div className="artwork-favorite-card shadow-sm">
                                                        <Link to={`/exhibits/single/${item.exhibit_museum_id}`}>
                                                            <div className="img-container">
                                                                <img
                                                                    src={item.primary_image_small}
                                                                    alt={item.exhibit_name}
                                                                    className="artwork-img-profile"
                                                                />
                                                            </div>
                                                        </Link>
                                                        <div className="artwork-body">
                                                            <p className="artwork-title">{item.exhibit_name}</p>
                                                            <button
                                                                className="btn remove-btn w-100"
                                                                onClick={() => handleDeleteFavorite(item.exhibit_museum_id)}
                                                            >
                                                                <i className="fas fa-trash-alt me-2"></i> Remove from Gallery
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-12 text-center py-5">
                                                <p className="text-muted italic">Your collection is empty. Start exploring!</p>
                                                <Link to="/exhibits" className="btn btn-dark btn-sm px-4">Browse Exhibits</Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};