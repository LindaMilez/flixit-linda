import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { BsFillTrash3Fill } from "react-icons/bs";
// import { FaSpinner } from "react-icons/fa";
import API from "../../API/API";
import { actionTypes } from "../../store/movieReducer";
import { removeFavourite, removeWatchList } from "../../API/mongodb";
import { Container, Spinner } from "reactstrap";
import { toast } from "react-toastify";

export const MovieCard = ({ movie, canRemove, onRemove, removingId }) => {
  if (!movie.id) {
    movie.id = movie.movieId;
  }
  return (
    <div className="col position-relative">
      {canRemove && (
        <button
          onClick={() => onRemove(movie.id)}
          className="position-absolute bg-warning rounded p-1"
          style={{ width: 30, top: 10, right: 20, zIndex: 100 }}
        >
          {
            removingId === movie.id ? <Spinner as="span" animation="border" role="status" size="sm" /> : <BsFillTrash3Fill size="small" />
          }
        </button>
      )}
      <Link to={`/movie/${movie.id}`}>
        <div className="card mb-4 rounded-3 shadow-sm">
          <img
            src={movie.poster_path ? `https://image.tmdb.org/t/p/w780/${movie.poster_path}` : `/movie-placeholder.png`}
            style={{ width: "auto" }}
            alt={movie.title}
          />
          <div className="card-body d-flex align-items-end">
            <button type="button" className="w-100 btn btn-sm btn-primary">
              {movie.original_title}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

const MovieCardsList = ({ filter = "popular" }) => {
  const dispatch = useDispatch();
  const { searchTerm } = useParams();
  const [removingId, setRemovingId] = useState(false);
  const [loading, setLoading] = useState(false);

  const { movies } = useSelector((state) => ({
    movies: state.movies[filter]
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

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true)
        let movies = [];
        if (filter === "popular") {
          movies = await API.fetchMovies();
        } else if (filter === "upcoming") {
          movies = await API.fetchUpcomingMovies();
        } else if (filter === "search") {
          movies = await API.serchMovies(searchTerm)
        }
        dispatch({
          type: actionTypes.SET_MOVIES,
          category: filter,
          payload: movies.results,
        });
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    
    if (filter !== "favourites" && filter !== "watchlist") {
      fetchMovies();
    }

    return () => setLoading(false);
  }, [filter, searchTerm, dispatch]);

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner as="span" animation="border" role="status" size="sm" />
      </Container>
    );
  }

  return (
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
  );
};
export default MovieCardsList;
