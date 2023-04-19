// import movieData from "./movies.json";

export const initialState = {
  popular: [], // movieData.results,
  moviesData: {},
  loading: false,
  favourites: [],
  watchlist: []
};

export const actionTypes = {
  GET_MOVIES: "GET_MOVIES",
  SET_MOVIES: "SET_MOVIES",
  GET_MOVIE_DATA: "GET_MOVIE_DATA",
  SET_MOVIE_DATA: "SET_MOVIE_DATA",
  SET_PERSONAL_DATA: "SET_PERSONAL_DATA",
  ADD_FAVOURITE: "ADD_FAVOURITE",
  REMOVE_FAVOURITE: "REMOVE_FAVOURITE",
  ADD_WATCH_LIST: "ADD_WATCH_LIST",
  REMOVE_WATCH_LIST: "REMOVE_WATCH_LIST",
};

const reducer = (state = initialState, action) => {
  const newState = { ...state };
  switch (action.type) {
    case actionTypes.GET_MOVIES: {
      newState[action.category] = [];
      newState.loading = true;
      return newState;
    }
    case actionTypes.SET_MOVIES: {
      newState[action.category] = action.payload;
      newState.loading = false;
      return newState;
    }
    case actionTypes.GET_MOVIE_DATA: {
      newState.loading = true;
      return newState;
    }
    case actionTypes.SET_MOVIE_DATA: {
      newState.loading = false;
      const moviesData = { ...newState.moviesData };
      moviesData[action.movieId] = action.payload;
      newState.moviesData = moviesData;
      return newState;
    }
    case actionTypes.SET_PERSONAL_DATA: {
      newState.loading = false;
      const { favourites, watchlist } = action.payload;
      newState.favourites = favourites;
      newState.watchlist = watchlist;
      return newState;
    }
    case actionTypes.ADD_FAVOURITE: {
      newState.favourites = [...newState.favourites, action.payload]
      return newState;
    }
    case actionTypes.REMOVE_FAVOURITE: {
      newState.favourites = newState.favourites.filter(mv => mv.movieId != action.payload)
      return newState;
    }
    case actionTypes.ADD_WATCH_LIST: {
      newState.watchlist = [...newState.watchlist, action.payload]
      return newState;
    }
    case actionTypes.REMOVE_WATCH_LIST: {
      newState.watchlist = newState.watchlist.filter(mv => mv.movieId != action.payload)
      return newState;
    }
    default:
      return newState;
  }
};

export default reducer;
