import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

import AuthComponent from "../component/auth";
import "../../styles/exhibit.css";

export const Exhibits = () => {
	let fallBackURL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzqX-q4R4VGGs1ArQpqZ-Y5deWIBVJ97KHOp4bkuQlmg&s"
	const { store, actions } = useContext(Context);
	const [artPieces , setArtPieces] = useState([])
	useEffect(()=>{
		setArtPieces(store.artPieces)
	},[store])
	return (
	<AuthComponent>	
		<div className="text-center mt-5 justify-content-center d-flex flex-wrap w-100">
			{/* <div>  */}
				{artPieces.map(item => (
					
				<div className="rowExhibit ">
					<div className="card" style={{width: "18rem", height: "420px", boxShadow: "10px 10px 20px 21px rgba(0, 0, 0, 0.2)", border:"15px solid black"}}>
						<Link to={`single/${item.objectID}`}>
  							<img src={item.primaryImageSmall} className="card-img-top" width="18rem" height="320px" onError= {(e)=>{e.target.src = fallBackURL}} alt={item.objectName} />
						</Link>
  								<div className="card-body overflow-auto">
    								<p className="card-text" style={{fontSize: "x-small"}}>{item.title}</p>
									<button className="exhibit-button" onClick=""><i class="fas fa-heart" aria-hidden="true"></i></button>
  								</div>
					</div>
					{/* <div className="card" style={{width: "18rem",}}>
						<Link to={`single/${item.objectID}`}>
  							<img src={item.primaryImageSmall} className="card-img-top" onError= {(e)=>{e.target.src = fallBackURL}} alt={item.objectName} />
						</Link>
  								<div className="card-body">
    								<p className="card-text">{item.title}</p>
									<button className="exhibit-button" onClick=""><i class="fas fa-heart" aria-hidden="true"></i></button>
  								</div>
					</div>
					<div className="card" style={{width: "18rem",}}>
						<Link to={`single/${item.objectID}`}>
  							<img src={item.primaryImageSmall} className="card-img-top" onError= {(e)=>{e.target.src = fallBackURL}} alt={item.objectName} />
						</Link>
  								<div className="card-body">
    								<p className="card-text">{item.title}</p>
									<button className="exhibit-button" onClick=""><i class="fas fa-heart" aria-hidden="true"></i></button>
  								</div>
					</div>	 */}
				</div>
						
					))}	
			{/* </div> */}
		</div>	
	</AuthComponent>
		
	);
};
