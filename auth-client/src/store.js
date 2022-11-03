import { configureStore } from "@reduxjs/toolkit";
import bookReducer from "./reducers/bookSlice";
import { booksApi } from "./services/api";
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
    books: bookReducer,
    [booksApi.reducerPath]: booksApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(booksApi.middleware)
});

export default store;