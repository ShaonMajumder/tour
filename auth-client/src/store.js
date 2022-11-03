import { configureStore } from "@reduxjs/toolkit";
import tourReducer from "./reducers/tourSlice";
import { toursApi } from "./services/api";
import React from "react";

const initialState = {
  loggedInState : false
}
export const AuthContext = React.createContext(initialState);
// const [loggedInState, setloggedInState] = useState(false);
// export const GlobalContext = React.useState(false);
// export const GlobalContext = createContext(initialState);

const store = configureStore({
  reducer: {
    tours: tourReducer,
    [toursApi.reducerPath]: toursApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(toursApi.middleware)
});

export default store;