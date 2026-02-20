const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            token: null,
            artPieces: [],
            artDepartments: [],
            bool: false,
            user: {} // Profile and favorites will be stored here
        },
        actions: {
        
        syncTokenFromSessionStorage: async () => {
            const token = sessionStorage.getItem("token");
            if (token && token !== "" && token !== undefined) {
            setStore({ token: token, bool: true });
        
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
                        
                        // load user profile immediately after login to sync favorites
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
                if (!store.token) return;

                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/user/profile`, { 
                        headers: { Authorization: `Bearer ${store.token}` }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setStore({ user: data }); // store the entire user object, including favorites, in the global store
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
                        setStore({ user: data }); // backend returns updated user profile with new favorites list, so we update the store with that data to keep it in sync
                    }
                } catch (error) {
                    console.error("Error adding favorite:", error);
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
                    }
                } catch (error) {
                    console.error("Error deleting favorite:", error);
                }
            }
        }
    };
};

export default getState;