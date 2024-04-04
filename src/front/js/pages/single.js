import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/single.css"

export const Single = (props) => {
  const { store, actions } = useContext(Context);
  const params = useParams();
  console.log(params.objectID);
  let exhibit = store.artPieces.find(
    (item) => item.exhibit_museum_id == params.objectID
  );

  return (
    <div className="m-auto" id="single-background" style={{width: "90%"}}>
      {/* make a for loop and create cards to reuse them in the department part */}
      {/* <p>This is the exhibit: {exhibit.exhibit_name} </p>
      <p>Artist: {exhibit.artist_name}</p>
      <p>Country of Origin: {exhibit.culture}</p>
      <p>Region: {exhibit.region}</p>
      <p>Date Created: {exhibit.object_date}</p> */}
      {/* <p>Department: {exhibit.department_museum_id}</p> */}
      <div className="card text-center mx-auto" id="single-background"
        style={{ maxWidth: "100%", border: "15px solid black", boxShadow: "10px 10px 20px 21px rgba(0,0,0,0.2)", marginTop: "50px", marginBottom: "50px" }}
        >
        <div className="row g-0">
          <div className="col-md-4">
            <img
              src={exhibit.primary_image_small}
              className="img-fluid rounded-start"
              alt="..."
              style={{margin: "10px",
                      border: "2px solid black"
            }}
            />
          </div>
          <div className="col-md-8">
            <div className="singlecard-body">
              <p className="singlecard-title m-auto" style={{backgroundColor: "white", width: "90%", border:"3px solid black"}}>
                Name: <span id="titleText" style={{fontWeight: "25"}}>{exhibit.exhibit_name}</span>
                <br />
                Artist Name: <span id="titleText"> {exhibit.artist_name}</span>
                <p className="singlecard-text mt-50px">
                <small className="text-body-secondary">
                  Culture:<span id="titleText"> {exhibit.culture}</span>
                  <br />
                  Region:<span id="titleText"> {exhibit.region}</span>
                  <br />
                  Object Date:<span id="titleText"> {exhibit.object_date}</span>
                </small>
              </p>
              </p>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
