// import movieData from "./movies.json";

export const initialState = {
  movies: [], // movieData.results,
  moviesData: {},
  loading: false,
  likes: [],
  watchlist: []
};

export const actionTypes = {
  GET_MOVIES: "GET_MOVIES",
  SET_MOVIES: "SET_MOVIES",
  GET_MOVIE_DATA: "GET_MOVIE_DATA",
  SET_MOVIE_DATA: "SET_MOVIE_DATA",
  SET_PERSONAL_DATA: "SET_PERSONAL_DATA",
  ADD_LIKE: "ADD_LIKE",
  REMOVE_LIKE: "REMOVE_LIKE",
  ADD_WATCH_LIST: "ADD_WATCH_LIST",
  REMOVE_WATCH_LIST: "REMOVE_WATCH_LIST",
};

const reducer = (state = initialState, action) => {
  const newState = { ...state };
  switch (action.type) {
    case actionTypes.GET_MOVIES: {
      newState.movies = [];
      newState.loading = true;
      return newState;
    }
    case actionTypes.SET_MOVIES: {
      newState.movies = action.payload;
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
      const { likes, watchlist } = action.payload;
      newState.likes = likes;
      newState.watchlist = watchlist;
      return newState;
    }
    case actionTypes.ADD_LIKE: {
      newState.likes = [...newState.likes, action.payload]
      return newState;
    }
    case actionTypes.REMOVE_LIKE: {
      newState.likes = newState.likes.filter(mv => mv.movieId !== action.payload)
      return newState;
    }
    case actionTypes.ADD_WATCH_LIST: {
      newState.watchlist = [...newState.watchlist, action.payload]
      return newState;
    }
    case actionTypes.REMOVE_WATCH_LIST: {
      newState.watchlist = newState.watchlist.filter(mv => mv.movieId !== action.payload)
      return newState;
    }
    default:
      return newState;
  }
};

export default reducer;
