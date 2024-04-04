const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            token: null,
            artPieces: [],
            artDepartments: [],
            bool: false,
            user: {}
        },
        actions: {
            onLoginClick: async (email, password) => {
                const response = await fetch(`${process.env.BACKEND_URL}/api/login`, {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }) 
                });

                if (response.ok) {
                    const data = await response.json();
                    sessionStorage.setItem("token", data.access_token);
                    setStore({ token: data.access_token, bool: true }); 
                    return true; // Indicate login success
                } else {
                    return false; // Indicate login failure without setting a message here
                }
            },

            redirecting: async () => {
                const token = sessionStorage.getItem("token");
                if (token) {
                    setStore({ token, bool: true });
                }
            },

            rehydrate: () => {
                const token = sessionStorage.getItem("token");
                if (token) {
                    setStore({ token });
                }
            },

            logOut: () => {
                setStore({ token: null });
                sessionStorage.clear();
            },

            getArtPiecesAndDepartments: () => {
                    fetch(`${process.env.BACKEND_URL}/api/exhibits-and-departments`)
                        .then(response => response.json())
                        .then(data => {
                            const store = getStore();
                            store.artPieces = data.exhibits;
                            store.artDepartments = data.departments
                            setStore(store);
                            
                        });
            },


            // getUser: () => {
            //     const token = sessionStorage.getItem("token");
            //     fetch(`${process.env.BACKEND_URL}/api/private`,
            //     {headers : {
            //         'Content-Type' : 'application/json',
            //         Authorization : Bearer + token
            //     }}
            //     )
            //             .then(response => response.json())
            //             .then(data => {
            //                 const store = getStore();
            //                 store.user = data;
            //                 console.log(store.user)
                            
            //             });
            // },

            // getDepartments: () => {
            //     fetch("https://collectionapi.metmuseum.org/public/collection/v1/departments")
            //         .then(response => response.json())
            //         .then(data => {
            //             setStore({ artDepartments: data.departments });
            //         });
            // },

            usersFavoritePage: async () => {
                const store = getStore();
                const response = await fetch(`${process.env.BACKEND_URL}/api/private`, { headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}`}});
                if (!response.ok) {
                    console.error("Failed to fetch user's information");
                    console.log(response,sessionStorage.getItem('token'))
                }else{
                    const data = await response.json()
                    setStore({user : data})
                }
            },

            addFavorite: async (exhibit_museum_id) => {
                const store = getStore();
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/addFavorite/${exhibit_museum_id}`, {
                        headers: {
                            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                        },
                        method: 'POST',
                    });

                    if (!response.ok) {
                        throw new Error('Error adding favorite');
                    }

                    const jsonResponse = await response.json();

                    console.log("Favorite succesfully added", jsonResponse);
                    setStore({user : jsonResponse})

                    
                } catch (error) {
                    console.error("Error adding favorite", error);
                    
                    
                }
            },

            deleteFavorite: async (exhibit_museum_id) => {
                const store = getStore();
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/deleteFavorite/${exhibit_museum_id}`, {
                        headers: {
                            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                        },
                        method: 'DELETE',
                    });

                    if (!response.ok) {
                        throw new Error('Error deleting favorite from favorites');
                    }

                    const jsonResponse = await response.json();
                    console.log("Favorite succesfully deleted", jsonResponse);
                    setStore({user : jsonResponse})


                    // Aquí puedes realizar acciones adicionales, como actualizar la UI
                } catch (error) {
                    console.error("Error! -> ", error);
                    // Manejar errores, por ejemplo, mostrar un mensaje al usuario
                }
            },

            authenticateUser: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/private`, { headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } });
                    if (!response.ok) {
                        console.log("Failed to authenticate the user. Your token may be invalid or expired");
                        return false;
                    } else {
                        console.log("User authenticated successfully");
                        return true;
                    }
                } catch (error) {
                    console.log("Authentication error:", error);
                    return false;
                }
            },
        }
    };
};

export default getState;
