import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { Single } from "./pages/single";
import { Departments } from "./pages/departments";
import { Contactus } from "./pages/contact";
import { Exhibits } from "./pages/exhibits";
import { Profile } from "./pages/profile";
import { Context } from "./store/appContext"; 
import injectContext from "./store/appContext";
import Login from "./component/login"
import { Department } from "./pages/department";
import { Museums } from "./pages/museums";

import Navbar from "./component/navbar";
import { Footer } from "./component/footer";
import SignUp from "../js/component/signup";

const Layout = () => {
    const { actions } = useContext(Context); 
    const basename = process.env.BASENAME || "";
    const [authAttempt, setAuthAttempt] = useState(null);
    const [authStatus, setAuthStatus] = useState('');

    // --- PERSISENCY EFFECT (HYDRATION) ---
    useEffect(() => {
        // verify if there's a token in sessionStorage and if so, update our global store with it
        actions.syncTokenFromSessionStorage();
    }, []);

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar authAttempt={authAttempt} />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Departments />} path="/departments" />
                        <Route element={<Contactus />} path="/contact" />
                        <Route element={<Exhibits />} path="/exhibits" />
                        <Route element={<Profile />} path="/profile" />
                        <Route element={<Department />} path="/department/:thedepartment" />
                        <Route element={<Museums />} path="/museums" />
                        <Route 
                            element={<Login setAuthAttempt={setAuthAttempt} setAuthStatus={setAuthStatus} />} 
                            path="/login" 
                        />
                        <Route element={<SignUp setAuthStatus={setAuthStatus} />} path="/signup" />
                        <Route element={<Single />} path="exhibits/single/:objectID" />
                        
                        <Route element={<div className="text-center mt-5"><h1>404! Page not found</h1></div>} path="*" />
                    </Routes>
                    <Footer /> 
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
