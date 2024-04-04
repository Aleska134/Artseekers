import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";

import "../../styles/departments.css";
import { Link } from "react-router-dom";

import AuthComponent from "../component/auth";

export const Departments = () => {
	const { store, actions } = useContext(Context);
	const [artDepartments , setArtDepartments] = useState([])
	
	useEffect(()=>{
			actions.getArtPiecesAndDepartments()
	},[])
	
	useEffect(() => {
		setArtDepartments(store.artDepartments)
		console.log(artDepartments);
	},[store.artDepartments])

	// console.log(artDepartments);
	return (
	
	<AuthComponent>
		<div className="text-center mt-5">
			<h1 className="seven" >DEPARTMENTS</h1>
			<div className="rowDepartments"> 
				{artDepartments.map(item => (
					<Link to={`/department/${item.department_museum_id}`}>
						<div className="art-Poster text-start">
						<button type="button" className="btn btn-warning">{item.name} </button>
						</div>
					</Link>
				))}
				<div className="departmentExamples">
					<div className="example"></div>
					<div className="example"></div>
					<div className="example"></div>
				</div>
			</div>
		</div>
	</AuthComponent>	
	);
	
};
