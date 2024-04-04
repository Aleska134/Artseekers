import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";

export const Department = props => {
	const { store, actions } = useContext(Context);
	const {id} = useParams();

	useEffect(()=>{
		actions.getEachDepartment(id)
		console.log(store.currentDepartment)
	},[])
    // let artPieces = store.artPieces.filter(item => item.department == params.thedepartment)
	return (
        <div>
            <p>this is the indiviual department page</p>
            {/* <div> 
				{artPieces.map(item => (
					<div className="rowExhibit">
					<Link to={`single/${item.objectID}`}>
						<div className="art-poster">
							<img className="w-100" src={item.primaryImageSmall} onError= {(e)=>{e.target.src = fallBackURL}} alt = {item.objectName} />
							<p>{item.title} </p>
						</div>
					</Link>
					<Link to={`single/${item.objectID}`}>
						<div className="art-poster">
							<img className="w-100" src={item.primaryImageSmall} onError= {(e)=>{e.target.src = fallBackURL}} alt = {item.objectName} />
							<p>{item.title} </p>
						</div>
					</Link>
					<Link to={`single/${item.objectID}`}>
						<div className="art-poster">
							<img className="w-100" src={item.primaryImageSmall} onError= {(e)=>{e.target.src = fallBackURL}} alt = {item.objectName} />
							<p>{item.title} </p>
						</div>
					</Link>
					</div>
						
					))}	
			</div> */}
            {/* {artPieces.map((item) => {
                <p>{item.displayName}</p>
            })} */}
        </div>
        
    )
}