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