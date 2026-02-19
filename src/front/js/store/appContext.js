// import React, { useState, useEffect } from "react";
// import getState from "./flux.js";

// // Don't change, here is where we initialize our context, by default it's just going to be null.
// export const Context = React.createContext(null);

// // This function injects the global store to any view/component where you want to use it, we will inject the context to layout.js, you can see it here:
// // https://github.com/4GeeksAcademy/react-hello-webapp/blob/master/src/js/layout.js#L35
// const injectContext = PassedComponent => {
// 	const StoreWrapper = props => {
// 		//this will be passed as the contenxt value
// 		const [state, setState] = useState(
// 			getState({
// 				getStore: () => state.store,
// 				getActions: () => state.actions,
// 				setStore: updatedStore =>
// 					setState({
// 						store: Object.assign(state.store, updatedStore),
// 						actions: { ...state.actions }
// 					})
// 			})
// 		);

// 		useEffect(() => {
// 			state.actions.getArtPiecesAndDepartments()
// 			state.actions.rehydrate()
// 		}, []);

// 		// The initial value for the context is not null anymore, but the current state of this component,
// 		// the context will now have a getStore, getActions and setStore functions available, because they were declared
// 		// on the state of this component
// 		return (
// 			<Context.Provider value={state}>
// 				<PassedComponent {...props} />
// 			</Context.Provider>
// 		);
// 	};
// 	return StoreWrapper;
// };

// export default injectContext;

import React, { useState, useEffect } from "react";
import getState from "./flux.js";

// Initialize the context. It will be shared across the entire application.
export const Context = React.createContext(null);

/**
 * Higher-Order Component (HOC) that injects the global store into the application.
 * It wraps the Layout component to provide access to 'store' and 'actions'.
 */
const injectContext = PassedComponent => {
	const StoreWrapper = props => {
		// The state holds the global 'store' and the 'actions' to manipulate it.
		const [state, setState] = useState(
			getState({
				getStore: () => state.store,
				getActions: () => state.actions,
				setStore: updatedStore =>
					setState({
						store: Object.assign(state.store, updatedStore),
						actions: { ...state.actions }
					})
			})
		);

		/**
		 * EFFECT: Application Initialization
		 * This runs only once when the application starts (mounts).
		 */
		useEffect(() => {
			/**
			 * 1. Synchronize the session token.
			 * Checks if a JWT exists in sessionStorage to restore the user session
			 * after a browser refresh.
			 */
			state.actions.syncTokenFromSessionStorage();

			/**
			 * 2. Pre-fetch initial data.
			 * Retrieves exhibits and departments from the backend to populate the gallery.
			 */
			state.actions.getArtPiecesAndDepartments();
			
		}, []);

		// Provide the state (store + actions) to the rest of the application via the Context Provider.
		return (
			<Context.Provider value={state}>
				<PassedComponent {...props} />
			</Context.Provider>
		);
	};
	return StoreWrapper;
};

export default injectContext;