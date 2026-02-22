import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/profile.css";

export const Profile = () => {
    const { store, actions } = useContext(Context);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        name: "",
        username: "",
        profile_image: ""
    });

    const defaultAvatar = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

    useEffect(() => {
        actions.getUserProfile();
    }, []);

    useEffect(() => {
        if (store.user) {
            setEditData({
                name: store.user.name || "",
                username: store.user.username || "",
                profile_image: store.user.profile_image || ""
            });
        }
    }, [store.user]);

    const handleSave = async () => {
        const success = await actions.updateUserProfile(editData);
        if (success) {
            setIsEditing(false);
        } else {
            alert("Error updating profile. Username might be taken.");
        }
    };

    const handleDeleteFavorite = (exhibit_museum_id) => {
        actions.deleteFavorite(exhibit_museum_id);
    };

    return (
        <div className="profile-page-container">
            <section className="gradient-custom-2">
                <div className="container py-md-5">
                    <div className="row justify-content-center">
                        <div className="col-12 col-xl-10">
                            <div className="profile-card shadow-lg border-0">
                                
                                {/* HEADER SECTON: Responsive Flex (Column on mobile, Row on desktop) */}
                                <div className="profile-header-black d-flex flex-column flex-md-row align-items-center align-items-md-end pb-3">
                                    
                                    {/* AVATAR GROUP: Anchor image and button together */}
                                    <div className="profile-avatar-wrapper mt-4 mt-md-0 ms-md-4">
                                        <div className="avatar-container shadow">
                                            <img
                                                src={store.user?.profile_image || defaultAvatar}
                                                alt="Profile"
                                                className="profile-img-style"
                                                onError={(e) => e.target.src = defaultAvatar}
                                            />
                                        </div>
                                        
                                        {!isEditing ? (
                                            <button className="btn btn-light btn-sm w-100 mt-2 edit-btn-text" onClick={() => setIsEditing(true)}>
                                                Edit Profile
                                            </button>
                                        ) : (
                                            <button className="btn btn-success btn-sm w-100 mt-2 edit-btn-text" onClick={handleSave}>
                                                Save Changes
                                            </button>
                                        )}
                                    </div>

                                    {/* USER INFO: Centered on mobile, Left-aligned on desktop */}
                                    <div className="ms-md-3 text-center text-md-start mt-3 mt-md-0 mb-md-2 flex-grow-1">
                                        {!isEditing ? (
                                            <>
                                                <h2 className="text-uppercase fw-bold mb-0 text-white">{store.user?.name || "Art Seeker"}</h2>
                                                <p className="fw-light text-white-50">@{store.user?.username}</p>
                                            </>
                                        ) : (
                                            <div className="edit-form-inline p-2 rounded mx-3 mx-md-0">
                                                <input 
                                                    className="form-control form-control-sm mb-2"
                                                    placeholder="Full Name"
                                                    value={editData.name}
                                                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                                                />
                                                <input 
                                                    className="form-control form-control-sm mb-2"
                                                    placeholder="Username"
                                                    value={editData.username}
                                                    onChange={(e) => setEditData({...editData, username: e.target.value})}
                                                />
                                                <input 
                                                    className="form-control form-control-sm"
                                                    placeholder="Profile Image URL"
                                                    value={editData.profile_image}
                                                    onChange={(e) => setEditData({...editData, profile_image: e.target.value})}
                                                />
                                                <button className="btn btn-link btn-sm text-white-50 p-0 mt-1" onClick={() => setIsEditing(false)}>Cancel</button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* STATS BAR: Responsive padding */}
                                <div className="stats-bar p-3 p-md-4 text-black border-bottom">
                                    <div className="d-flex justify-content-center justify-content-md-end text-center">
                                        <div className="px-3 border-end">
                                            <p className="mb-0 h5">{store.user?.favorites?.length || 0}</p>
                                            <p className="small text-muted mb-0">Saved pieces</p>
                                        </div>
                                        <div className="px-3">
                                            <p className="mb-0 h5">Status</p>
                                            <p className="small text-muted mb-0">Curator</p>
                                        </div>
                                    </div>
                                </div>

                                {/* FAVORITES GRID */}
                                <div className="card-body p-4 text-black">
                                    <h5 className="lead fw-normal mb-4 text-center text-md-start">YOUR PRIVATE GALLERY</h5>
                                    
                                    <div className="row g-4">
                                        {store.user?.favorites && store.user.favorites.length > 0 ? (
                                            store.user.favorites.map((item, index) => (
                                                <div key={item.exhibit_museum_id || index} className="col-12 col-md-6 col-lg-4">
                                                    <div className="artwork-favorite-card h-100 shadow-sm">
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
                                                            <button className="btn remove-btn w-100" onClick={() => handleDeleteFavorite(item.exhibit_museum_id)}>
                                                                <i className="fas fa-trash-alt me-2"></i> Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-12 text-center py-5">
                                                <p className="text-muted italic font-monospace">Explore the museum to add pieces here.</p>
                                                <Link to="/exhibits" className="btn btn-dark btn-sm px-4">Browse Gallery</Link>
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