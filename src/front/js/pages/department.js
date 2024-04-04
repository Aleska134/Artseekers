import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";

import "../../styles/exhibit.css";

export const Department = (props) => {
  const { store, actions } = useContext(Context);
  const params = useParams();
  const handleFavorite = (exhibit_museum_id) => {
    actions.addFavorite(exhibit_museum_id);
    console.log(store.user);
  };

  const department = store.artDepartments.find(dept => dept.department_museum_id.toString() === params.thedepartment);
    const departmentName = department ? department.name : 'Department';

  let artPieces = store.artPieces.filter(
    (item) => item.department_museum_id.toString() === params.thedepartment
  );

  return (
    <div>
    <h1 className="text-center mt-5">{departmentName}</h1>
      <div className="text-center mt-5 justify-content-center d-flex flex-wrap w-100" id="main">
        {artPieces.map((item, index) => (
          <div className="rowExhibit">
            <Link to={`../../exhibits/single/${item.exhibit_museum_id}`}>
              <div
                className="card"
                style={{
                  width: "18rem",
                  height: "420px",
                  boxShadow: "10px 10px 20px 21px rgba(0, 0, 0, 0.2)",
                  border: "15px solid black",
                }}
              >
                <Link to={`single/${item.exhibit_museum_id}`}>
                  <img
                    src={item.primary_image_small}
                    className="card-img-top"
                    width="18rem"
                    height="320px"
                    onError={(e) => {
                      e.target.src = fallBackURL;
                    }}
                    alt={item.exhibit_name}
                  />
                </Link>
                <div className="card-body overflow-auto mb-2">
                  <p className="card-text" style={{ fontSize: "x-small" }}>
                    {item.exhibit_name}{" "}
                  </p>
                  <button
                    className="exhibit-button"
                    onClick={() => {
                      handleFavorite(item.exhibit_museum_id);
                    }}
                  >
                    <i class="fas fa-heart" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
