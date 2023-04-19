import userReducer from "./userReducer";
import movieReducer from "./movieReducer";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";

const rootReducer = combineReducers({
  user: userReducer,
  movies: movieReducer,
});

export default function configureAppStore(preloadedState) {
  const store = configureStore({
    reducer: rootReducer,
    middleware: [thunk],
    preloadedState,
  });

  return store;
}
