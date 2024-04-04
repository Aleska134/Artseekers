import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";

export const Single = (props) => {
  const { store, actions } = useContext(Context);
  const params = useParams();
  console.log(params.objectID);
  let exhibit = store.artPieces.find(
    (item) => item.exhibit_museum_id == params.objectID
  );

  return (
    <div className="m-auto">
      {/* make a for loop and create cards to reuse them in the department part */}
      {/* <p>This is the exhibit: {exhibit.exhibit_name} </p>
      <p>Artist: {exhibit.artist_name}</p>
      <p>Country of Origin: {exhibit.culture}</p>
      <p>Region: {exhibit.region}</p>
      <p>Date Created: {exhibit.object_date}</p> */}
      {/* <p>Department: {exhibit.department_museum_id}</p> */}
      <div className="card text-center" style={{ maxWidth: "1000px" }}>
        <div className="row g-0">
          <div className="col-md-4">
            <img src="" className="img-fluid rounded-start" alt="..." />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h5 className="card-title">{exhibit.exhibit_name}<br/>{exhibit.artist_name}</h5>
              <p className="card-text"></p>
              <p className="card-text">
                <small className="text-body-secondary">{exhibit.culture}<br/>{exhibit.region}<br/>{exhibit.object_date}</small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
