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

            getEachDepartment: async(departmentId) => {
                let response = await fetch(`${process.env.BACKEND_URL}/api/single_department/${departmentId}`)
                let data = response.json()
                console.log(data)
                setStore({currentDepartment:data})
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
                    store.user = data
                    console.log(store.user)
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
