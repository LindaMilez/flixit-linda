import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { BsFillTrash3Fill } from "react-icons/bs";
import { FaSpinner } from "react-icons/fa";
import API from "../../API/API";
import { actionTypes } from "../../store/movieReducer";
import { removeLike, removeWatchList } from "../../API/mongodb";
import { Container, Spinner } from "reactstrap";
import { toast } from "react-toastify";

const MovieCard = ({ movie, canRemove, onRemove, removingId }) => {
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
            removingId === movie.id ? <FaSpinner /> : <BsFillTrash3Fill size="small" />
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

const MovieCardsList = ({ filter }) => {
  const dispatch = useDispatch();
  const { searchTerm } = useParams();
  const [removingId, setRemovingId] = useState(false);

  const { movies, loading } = useSelector((state) => ({
    loading: state.movies.loading,
    movies:
      filter === "all" || filter === "search"
        ? state.movies.movies
        : filter === "watchlist"
        ? state.movies.watchlist
        : state.movies.likes,
  }));

  const onRemove = async (movieId) => {
    try {
      setRemovingId(movieId);
      await (filter === "watchlist"
        ? removeWatchList(movieId)
        : removeLike(movieId));
      dispatch({
        type:
          filter === "watchlist"
            ? actionTypes.REMOVE_WATCH_LIST
            : actionTypes.REMOVE_LIKE,
        payload: movieId,
      });
    } catch (error) {
      toast(error.message);
      console.error(error);
    }
    setRemovingId(false);
  };

  useEffect(() => {
    const fetchMovies = async (searchTerm) => {
      try {
        const movies = await (searchTerm
          ? API.serchMovies(searchTerm)
          : API.fetchMovies());
        dispatch({
          type: actionTypes.SET_MOVIES,
          payload: movies.results,
        });
      } catch (error) {
        console.error(error);
      }
    };
    if (filter === "search" && searchTerm) {
      fetchMovies(searchTerm);
    }
    if (filter === "all" && movies.length === 0) {
      fetchMovies();
    }
  }, [movies, filter, searchTerm]);

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
