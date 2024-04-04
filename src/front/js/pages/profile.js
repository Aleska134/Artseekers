import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/home.css";
import "../../styles/profile.css";

export const Profile = () => {
  const { store, actions } = useContext(Context);
  useEffect(() => {
    actions.usersFavoritePage();
  }, []);
  const handleDeleteFavorite = (exhibit_museum_id) => {
    actions.deleteFavorite(exhibit_museum_id);
    actions.usersFavoritePage();
    console.log(store.user);
  };
  return (
    <div className="text-center mb-0" id="background-color">
      <section className="h-100 gradient-custom-2">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-lg-12 col-xl-12">
              <div className="profile-card">
                <div
                  className="rounded-top text-white d-flex flex-row"
                  style={{ backgroundColor: "#000", height: "200px" }}
                >
                  <div
                    className="ms-4 mt-5 d-flex flex-column"
                    style={{ width: "150px" }}
                  >
                    <img
                      src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      alt="Generic placeholder image"
                      className="img-fluid img-thumbnail mt-4 mb-2"
                      style={{ width: "150px", zIndex: "1" }}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-dark w-100"
                      data-mdb-ripple-color="dark"
                      style={{
                        zIndex: "1",
                        marginTop: "-21px",
                        marginLeft: "155px",
                      }}
                    >
                      Edit profile
                    </button>
                  </div>
                  <div className="ms-3" style={{ marginTop: "130px" }}>
                    <h5>{store.user?.name}</h5>
                    <p className="text-start fw-lighter">
                      {store.user?.username}
                    </p>
                  </div>
                </div>
                <div
                  className="p-4 text-black"
                  style={{ backgroundColor: "#F8F9FA" }}
                >
                  <div className="d-flex justify-content-end text-center py-1"></div>
                </div>
                <div className="card-body p-4 text-black flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <p className="lead fw-normal mb-0 text-decoration-underline">
                      FAVORITES
                    </p>
                  </div>
                  <div className="row">
                    {store.user?.favorites?.map((item, index) => (
                      <div
                        key={index}
                        className="col-md-4 mb-4" // Adjust this according to your needs
                      >
                        <div
                          className="card"
                          style={{
                            width: "100%", // Adjust according to your needs
                            height: "auto",
                            boxShadow: "10px 10px 20px 21px rgba(0, 0, 0, 0.2)",
                            border: "15px solid black",
                          }}
                        >
                          <Link
                            to={`../exhibits/single/${item.exhibit_museum_id}`}
                          >
                            <img
                              src={item.primary_image_small}
                              alt="image 1"
                              className="w-50 rounded-3"
                              style={{marginTop: "15px",
                                      border: "2px solid black",
                                      height: "250px"
                                    }}
                            />
                          </Link>

                          <div className="profile-col card-body overflow-auto mb-2">
                            <p style={{fontSize:"20px"}}>{item.exhibit_name}</p>&nbsp;&nbsp;&nbsp;
                            <button
                              // style={{float: "right"}}
                              className="profileButton"
                              id="trashprofileButton"
                              onClick={() =>
                                handleDeleteFavorite(item.exhibit_museum_id)
                              }
                            >
                              <i
                                className="fas fa-trash text-center "
                                aria-hidden="true"
                                // style={{"height": "5px"}}
                                id= "texttrash"
                              ></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
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