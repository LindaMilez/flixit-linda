import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MovieCard } from "./MovieCardsList";
import { actionTypes } from "../../store/movieReducer";
import { removeFavourite, removeWatchList } from "../../API/mongodb";
import { toast } from "react-toastify";
import useLogin from "../hooks/useLogin";
import { getTitle } from "../pages/Home/Home";
import Navbar from "./Navbar";

const Favourites = ({ filter }) => {
  
  const loginUser = useLogin();
  const title = getTitle(filter);

  const dispatch = useDispatch();
  const [removingId, setRemovingId] = useState(false);

  const { movies } = useSelector((state) => ({
    movies: state.movies[filter],
  }));

  const onRemove = async (movieId) => {
    try {
      setRemovingId(movieId);
      await (filter === "watchlist"
        ? removeWatchList(movieId)
        : removeFavourite(movieId));
      dispatch({
        type:
          filter === "watchlist"
            ? actionTypes.REMOVE_WATCH_LIST
            : actionTypes.REMOVE_FAVOURITE,
        payload: movieId,
      });
    } catch (error) {
      toast(error.message);
      console.error(error);
    }
    setRemovingId(false);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <Navbar filter={filter} />
        <main className={`col-md-9 ${loginUser ? 'ms-sm-auto' : 'mx-sm-auto'}  col-lg-10 px-md-4`}>
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">{ title }</h1>
          </div>
          <div className="row row-cols-1 row-cols-md-4 mb-3 text-center">
            {movies?.map?.((movie) => (
              <MovieCard
                movie={movie}
                key={movie.id || movie.movieId}
                removingId={removingId}
                canRemove={filter === "watchlist" || filter === "favourites"}
                onRemove={onRemove}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};
export default Favourites;
