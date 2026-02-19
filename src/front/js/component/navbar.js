// import React, { useState , useEffect, useContext } from "react";
// import { Link } from "react-router-dom";
// import logoImage from "../../img/logo.jpg";
// import {Context} from "../store/appContext"


// const Navbar = ({authAttempt}) => {
// const [authStatus, setAuthStatus] = useState("pending")
// const {store,actions} = useContext(Context)
// const token = store.token


// useEffect(()=>{
//   let authenticate = async () => {
//     console.log(store.token)
//     let result = await actions.authenticateUser()
//     if(result){
//       setAuthStatus("approved")
//       console.log("authenticateUser")
//     }else{
//       setAuthStatus("denied")
//     }
//   }
//   authenticate()
// },[authAttempt])



//     return (
//       <React.Fragment>
//         <nav className="navbar navbar-expand-lg navbar-dark navbar-style">
//           <div className="container-fluid">
          
//           <img className="navbar-logo" src={logoImage} />
          
//             <a className="navbar-brand" href="/#">
//               ArtSeekers
//             </a>
//             <button
//               className="navbar-toggler"
//               type="button"
//               data-bs-toggle="collapse"
//               data-bs-target="#navbarSupportedContent"
//               aria-controls="navbarSupportedContent"
//               aria-expanded="false"
//               aria-label="Toggle navigation"
//             >
//               <span className="navbar-toggler-icon"></span>
//             </button>
//             <div
//               className="collapse navbar-collapse"
//               id="navbarSupportedContent"
//             >
//               <ul className="navbar-nav mr-auto">
//                 <li className="nav-item">
//                   <Link to="/" className="nav-link">
//                     Home
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link to="/museums" className="nav-link">
//                     Museums
//                   </Link>
//                 </li>
//               {store.token?(
                
//                 <div className="d-flex">
//               <li className="nav-item">
//                   <Link to="/exhibits" className="nav-link">
//                     Exhibits
//                   </Link>
//                 </li>

//                </div>
              
//                 ):''}
//                 {store.token?(
                
//                 <div className="d-flex">

//                 <li className="nav-item">
//                   <Link to="/departments" className="nav-link">
//                     Departments
//                   </Link>
//                 </li>
//                 </div>
              
//                 ):''}

//                 <li className="nav-item">
//                   <Link to="/contact" className="nav-link">
//                     Contact Us
//                   </Link>
//                 </li>

//                 {/* </div> */}
//                 {store.token ?(
//                   <div>
//                 <li className="nav-item">
//                   <Link to="/profile" className="nav-link">
//                     Profile
//                   </Link>
//                 </li>
//                 </div>
//                 ):''}


//               </ul>
//             </div>
//             {store.token ?(
//             <div className="text-end p-3">
//             <Link to="/" className="nav-link">
//               <button className="btn btn-danger" onClick={() => actions.logOut() }>
//                 Logout
//               </button>
//                   </Link>
              
//           </div>
//                         ):(
//                         <div className="text-end p-3">
//                         <Link to="/login" className="nav-link">
//                           <button className="btn btn-primary">
//                             Login
//                           </button>
            
//                               </Link>
                          
//                       </div>)
//             }

//           </div>
//         </nav>
//       </React.Fragment>
//     );
//   }


// export default Navbar;
import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import logoImage from "../../img/logo.jpg";
import { Context } from "../store/appContext";

const Navbar = () => {
    const { store, actions } = useContext(Context);

    /**
     * EFFECT: State Hydration
     * Automatically fetches user profile data if a token exists in the store
     * but the user object is still empty (e.g., after a page refresh).
     */
    useEffect(() => {
        if (store.token && !store.user?.name) {
            actions.getUserProfile();
        }
    }, [store.token]);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark navbar-style shadow-sm">
            <div className="container-fluid">
                {/* Brand Logo and Name */}
                <Link to="/" className="d-flex align-items-center text-decoration-none">
                    <img 
                        className="navbar-logo" 
                        src={logoImage} 
                        alt="ArtSeekers Logo" 
                        style={{ width: "40px", borderRadius: "50%" }} 
                    />
                    <span className="navbar-brand ms-2 mb-0 h1">ArtSeekers</span>
                </Link>

                {/* Responsive Toggle Button */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    {/* Navigation Links */}
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link to="/" className="nav-link">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/museums" className="nav-link">Museums</Link>
                        </li>

                        {/** 
                         * CONDITIONALLY RENDERED ROUTES
                         * These links are only accessible to authenticated users.
                         */}
                        {store.token && (
                            <>
                                <li className="nav-item">
                                    <Link to="/exhibits" className="nav-link">Exhibits</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/departments" className="nav-link">Departments</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/profile" className="nav-link">
                                        <i className="fas fa-user-circle me-1"></i> Profile
                                    </Link>
                                </li>
                            </>
                        )}

                        <li className="nav-item">
                            <Link to="/contact" className="nav-link">Contact Us</Link>
                        </li>
                    </ul>

                    {/* AUTHENTICATION SECTION */}
                    <div className="d-flex align-items-center">
                        {store.token ? (
                            <div className="d-flex align-items-center">
                                {/* Display user greeting if data is available */}
                                <span className="text-light me-3 small d-none d-md-inline">
                                    Welcome back, <strong>{store.user?.name || "ArtSeeker"}</strong>
                                </span>
                                <button 
                                    className="btn btn-outline-danger btn-sm" 
                                    onClick={() => actions.logOut()}
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link to="/login">
                                <button className="btn btn-primary btn-sm">Login</button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;