const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            token: null,
            artPieces: [],
            artDepartments: [],
            bool: false,
            user: {}, // Stores profile data and favorites
            guestAIRemaining: null, // Free AI analyses left today for visitors without an account
            guestAILimit: 3
        },
        actions: {
            /**
             * AUTH HYDRATION:
             * Syncs the session token from Storage to the Global Store
             * and fetches the user profile if the token is valid.
             */
            syncTokenFromSessionStorage: async () => {
                const token = sessionStorage.getItem("token");
                if (token && token !== "" && token !== undefined) {
                    setStore({ token: token, bool: true });
                    // Fetch profile immediately to ensure UI is in sync
                    await getActions().getUserProfile(); 
                }
            },

            onLoginClick: async (email, password) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/login`, {
                        method: 'POST',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, password })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        sessionStorage.setItem("token", data.access_token);
                        setStore({ token: data.access_token, bool: true });
                        await getActions().getUserProfile();
                        return true;
                    }
                    return false;
                } catch (error) {
                    console.error("Login error:", error);
                    return false;
                }
            },

            logOut: () => {
                sessionStorage.removeItem("token");
                setStore({ token: null, bool: false, user: {} });
            },

            getUserProfile: async () => {
                const store = getStore();
                const token = sessionStorage.getItem("token");
                if (!token) return;

                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/user/profile`, { 
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    if (response.status === 401) {
                        // Handle expired token by forcing logout
                        getActions().logOut(); 
                        return;
                    }

                    if (response.ok) {
                        const data = await response.json();
                        setStore({ user: data });
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                }
            },

            getArtPiecesAndDepartments: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/exhibits-and-departments`);
                    const data = await response.json();
                    setStore({ 
                        artPieces: data.exhibits, 
                        artDepartments: data.departments 
                    });
                } catch (error) {
                    console.error("Error loading artworks:", error);
                }
            },

            addFavorite: async (exhibit_museum_id) => {
                const store = getStore();
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/addFavorite/${exhibit_museum_id}`, {
                        method: 'POST',
                        headers: { Authorization: `Bearer ${store.token}` }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setStore({ user: data });
                    } else if (response.status === 401) {
                        getActions().logOut(); 
                    }
                } catch (error) {
                    console.error("Error adding favorite:", error);
                }
            },

            updateUserProfile: async (updatedData) => {
                const store = getStore();
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/user/update`, {
                        method: 'PUT',
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${store.token}`
                        },
                        body: JSON.stringify(updatedData)
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setStore({ user: data });
                        return true;
                    } else if (response.status === 401) {
                        getActions().logOut(); 
                    }
                    return false;
                } catch (error) {
                    console.error("Error updating profile:", error);
                    return false;
                }
            },

          
            /**
             * Asks the AI curator about one artwork. Returns an object:
             * { insight, guestRemaining, signupRequired }.
             * Guests (no token) get a few free new analyses per day.
             */
            getAIInsight: async (exhibit_museum_id) => {
                const store = getStore();
                const headers = { "Content-Type": "application/json" };
                if (store.token) headers.Authorization = `Bearer ${store.token}`;
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/ai/explain`, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify({ exhibit_museum_id })
                    });
                    const data = await response.json().catch(() => ({}));

                    if (response.ok) {
                        if (typeof data.guest_remaining === "number") {
                            setStore({ guestAIRemaining: data.guest_remaining });
                        }
                        return { insight: data.insight, guestRemaining: data.guest_remaining };
                    } else if (response.status === 429 && data.signup_required) {
                        setStore({ guestAIRemaining: 0 });
                        return { signupRequired: true };
                    } else if (response.status === 503) {
                        return { insight: "The AI Historian is currently waking up. Please try again in 10 seconds." };
                    } else if (response.status === 429) {
                        // Gemini free-tier rate/quota limit hit.
                        return { insight: "The AI curator has reached its analysis quota for now. Please try again in a little while." };
                    } else if (response.status === 401) {
                        getActions().logOut();
                    }
                    return { insight: "The curator is currently unavailable. Please try again later." };
                } catch (error) {
                    console.error("AI Insight Error:", error);
                    return { insight: "Connection error with the AI engine." };
                }
            },

            /** Loads how many free analyses a guest has left today. */
            getGuestAIQuota: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/ai/guest-quota`);
                    if (response.ok) {
                        const data = await response.json();
                        setStore({ guestAIRemaining: data.remaining, guestAILimit: data.limit });
                    }
                } catch (error) {
                    console.error("Guest quota error:", error);
                }
            },

            changePassword: async (oldPassword, newPassword) => {
                const store = getStore();
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/user/change-password`, {
                        method: 'PUT',
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${store.token}`
                        },
                        body: JSON.stringify({ 
                            old_password: oldPassword, 
                            new_password: newPassword 
                        })
                    });

                    const data = await response.json();
                    if (response.ok) {
                        return { success: true, message: data.message };
                    }
                    return { success: false, message: data.message };
                } catch (error) {
                    console.error("Error changing password:", error);
                    return { success: false, message: "Server error" };
                }
            },

            deleteFavorite: async (exhibit_museum_id) => {
                const store = getStore();
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/deleteFavorite/${exhibit_museum_id}`, {
                        method: 'DELETE',
                        headers: { Authorization: `Bearer ${store.token}` }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setStore({ user: data });
                    } else if (response.status === 401) {
                        getActions().logOut(); 
                    }
                } catch (error) {
                    console.error("Error deleting favorite:", error);
                }
            }
        }
    };
};

export default getState;