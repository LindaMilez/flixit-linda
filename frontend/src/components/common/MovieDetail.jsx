import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Spinner } from "reactstrap";
import { BsHeartFill, BsPlusCircleFill, BsStar, BsStarFill, BsYoutube } from "react-icons/bs";
import { CircularProgressbar } from "react-circular-progressbar";
import Rating from "react-rating";
import { toast } from "react-toastify";
import API from "../../API/API";
import { actionTypes } from "../../store/movieReducer";
import {
  addFavourite,
  addWatchList,
  getMovieRating,
  removeFavourite,
  removeWatchList,
  setMovieRating,
} from "../../API/mongodb";
import "react-circular-progressbar/dist/styles.css";
import useLogin from "../hooks/useLogin";
import VideoModal from "./VideoModal";

const getRuntime = (mins) => {
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  let str = `${hrs}h`;
  if (rem > 0) {
    str = `${str} ${rem}m`;
  }
  return str;
};

const Directors = ({ personsArr }) => {
  return (
    <div className="d-flex gap-2 mb-3">
      {personsArr.map((p) => (
        <div style={{ width: 40, height: 40 }} className="rounded" key={p.id}>
          <img
            src={`https://image.tmdb.org/t/p/w92/${p.profile_path}`}
            className="img-thumbnail"
            alt={p.name}
            title={p.name}
          />
        </div>
      ))}
    </div>
  );
};

const MovieDetails = () => {
  const { movieId } = useParams();
  const dispatch = useDispatch();
  const loginUser = useLogin();
  const [loading, setLoading] = useState(false);
  const [isVideoOpen, setVideoOpen] = useState(false);
  const [removing, setRemoving] = useState({
    favourite: false,
    watchlist: false,
  });

  let { movie, favourites, watchlist } = useSelector((state) => ({
    movie: state.movies.moviesData[movieId],
    favourites: state.movies.favourites,
    watchlist: state.movies.watchlist,
  }));

  const movieBasicInfo = movie
    ? {
        movieId: movie.id,
        title: movie.title,
        backdrop_path: movie.backdrop_path,
        original_language: movie.original_language,
        original_title: movie.original_title,
        overview: movie.overview,
        popularity: movie.popularity,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
      }
    : {};

  const isLiked = useMemo(() => {
    return !!favourites?.find?.((mv) => mv.movieId == movieId);
  }, [favourites, movieId]);

  const inWatchList = useMemo(() => {
    return !!watchlist?.find?.((mv) => mv.movieId == movieId);
  }, [watchlist, movieId]);

  const getMovieDetails = useCallback(async () => {
    try {
      setLoading(true);
      const movie = await API.fetchMovie(movieId);
      const credits = await API.fetchCredits(movieId);
      const videos = await API.fetchVideos(movieId);
      const rating = await getMovieRating(movieId);
      // Get directors only
      const directors = credits.crew.filter(
        (member) => member.job === "Director"
      );

      dispatch({
        type: actionTypes.SET_MOVIE_DATA,
        movieId,
        payload: {
          ...movie,
          actors: credits.cast,
          directors,
          videos: videos.results,
          rating: rating
        },
      });
    } catch (error) {
      toast(error.message);
    }
    setLoading(false);
  }, [dispatch, movieId]);

  useEffect(() => {
    if (!movie) {
      getMovieDetails();
    }
  }, [movie, getMovieDetails]);

  const handlePlayVideo = () => setVideoOpen(true);
  const onCloseVideo = () => setVideoOpen(false);

  const handleLike = async () => {
    try {
      setRemoving({ ...removing, favourite: true });
      await (isLiked ? removeFavourite(movieId) : addFavourite(movieBasicInfo));
      dispatch({
        type: isLiked
          ? actionTypes.REMOVE_FAVOURITE
          : actionTypes.ADD_FAVOURITE,
        payload: isLiked ? movieId : movieBasicInfo,
      });
    } catch (error) {
      toast(error.message);
      console.error(error);
    }
    setRemoving({ ...removing, favourite: false });
  };

  const handleAddToWatch = async () => {
    try {
      setRemoving({ ...removing, watchlist: true });
      await (inWatchList
        ? removeWatchList(movieId)
        : addWatchList(movieBasicInfo));
      dispatch({
        type: inWatchList
          ? actionTypes.REMOVE_WATCH_LIST
          : actionTypes.ADD_WATCH_LIST,
        payload: inWatchList ? movieId : movieBasicInfo,
      });
    } catch (error) {
      toast(error.message);
      console.error(error);
    }
    setRemoving({ ...removing, watchlist: false });
  };

  const handleRating = async (val) => {
    const newRating = await setMovieRating(movieId, val);
    dispatch({
      type: actionTypes.SET_MOVIE_DATA,
      movieId,
      payload: {
        ...movie,
        rating: newRating
      },
    });
  }

  const teaserVideo = movie?.videos?.find?.(
    (v) => v.site === "YouTube" && v.type === "Teaser"
  );

  const rating = {
    average: movie?.rating?.aggregate[0]?.average || 0,
    myrating: movie?.rating?.rating?.rating || 0
  }
  
  return (
    <div className="container my-5">
      {loading ? (
        <span>Fetching details</span>
      ) : movie ? (
        <div className="row pb-0 pe-lg-0 align-items-start rounded-3 border shadow-lg bg-dark text-white border-dashed border-bottom">
          <div className="col-lg-7 px-3 p-lg-5">
            <h2 className="fw-bold lh-2 text-body-emphasis">{movie.title}</h2>
            <div className="d-flex gap-3 mb-3">
              <span className="text-info">
                {movie.release_date}({movie.original_language})
              </span>
              <span className="text-warning">
                {movie.genres.map?.((mv) => mv.name).join?.(", ")}
              </span>
              <span className="text-danger">{getRuntime(movie.runtime)}</span>
            </div>
            <span style={{ fontSize: 19 }} className="fw-bold">
              Overview
            </span>
            <p className="lead pt-1" style={{ fontSize: 15 }}>
              {movie.overview}
            </p>
            <div className="gap-3 d-flex">
              <div
                style={{ width: 100, height: 50, backgroundColor: "#3b4ff83b" }}
                className="p-1 rounded d-flex"
              >
                <CircularProgressbar
                  value={movie.vote_average}
                  maxValue={10}
                  text={`${movie.vote_average}%`}
                />
                <span>User score</span>
              </div>
              {/* {loginUser && (
                <> */}
                  <Button onClick={handleLike} disabled={removing.favourite || !loginUser}>
                    {removing.favourite ? (
                      <Spinner
                        as="span"
                        animation="border"
                        role="status"
                        size="sm"
                      />
                    ) : (
                      <BsHeartFill color={isLiked ? "red" : "black"} />
                    )}{" "}
                    <span title={!loginUser && "Signin required"}>Like</span>
                    {isLiked && "d"}
                  </Button>
                  <Button
                    onClick={handleAddToWatch}
                    disabled={removing.watchlist || !loginUser}
                  >
                    {removing.watchlist ? (
                      <Spinner
                        as="span"
                        animation="border"
                        role="status"
                        size="sm"
                      />
                    ) : (
                      <BsPlusCircleFill color={inWatchList ? "red" : "black"} />
                    )}{" "}
                    <span title={!loginUser && "Signin required"}>Add to watch list</span>
                  </Button>
                {/* </>
              )} */}
              <div
                style={{ height: 50, fontSize: '2rem', backgroundColor: "#3b4ff83b" }}
                className="px-3 rounded d-flex fw-bold justify-content-center align-items-center"
              >
                { rating.average } / 5
              </div>
            </div>
            {teaserVideo && (
              <div className="gap-3 d-flex mt-3">
                <Button onClick={handlePlayVideo} className="border-0">
                  <BsYoutube width="20" color="red" /> Play Trailer
                </Button>
                <VideoModal
                  onClose={onCloseVideo}
                  isOpen={isVideoOpen}
                  video={teaserVideo}
                />
              </div>
            )}
            <div className="d-flex flex-column mt-3" title={!loginUser && "Signin required"}>
              <span>My Rating</span>
              <Rating readonly={!loginUser} onChange={handleRating} placeholderRating={rating.myrating} placeholderSymbol={<BsStarFill size="30" color="gold" />} fullSymbol={<BsStarFill size="30" color="gold" />} emptySymbol={<BsStar size="30" />} />
            </div>
          </div>
          <div
            className="col-lg-5 p-0 overflow-hidden shadow-lg rounded-lg-3"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/w780/${movie.backdrop_path})`,
              backgroundPosition: "center",
            }}
          >
            <div
              className="justify-content-center d-flex"
              style={{ backgroundColor: "#071832bf" }}
            >
              <img
                className="rounded-lg-3 mx-auto"
                src={`https://image.tmdb.org/t/p/w780/${movie.poster_path}`}
                alt=""
                height={500}
              />
            </div>
          </div>
          <div className="border-bottom mx-auto" style={{ width: "95%" }}>
            {" "}
          </div>
          <div className="d-grid d-md-flex justify-content-start gap-3 mb-4 mb-lg-3 px-3 p-lg-5">
            <div className="list-group col-3 bg-dark border">
              <button className="list-group-item list-group-item-action bg-dark d-flex justify-content-between">
                <span className="text-white">Rating </span>
                <span className="badge bg-warning">{`${movie.vote_average} / 10`}</span>
              </button>
              <button className="list-group-item list-group-item-action bg-dark d-flex justify-content-between">
                <span className="text-white">Votes </span>
                <span className="text-info">{`${movie.vote_count}`}</span>
              </button>
              <button className="list-group-item list-group-item-action bg-dark d-flex justify-content-between align-items-center">
                <span className="text-white">Directors </span>
                <span className="text-info">
                  <Directors personsArr={movie.directors} />
                </span>
              </button>
              <button className="list-group-item list-group-item-action bg-dark d-flex justify-content-between">
                <span className="text-white">Released </span>
                <span className="text-info">{movie.release_date}</span>
              </button>
              <button className="list-group-item list-group-item-action bg-dark d-flex justify-content-between">
                <span className="text-white">Language </span>
                <span className="text-info">{movie.original_language}</span>
              </button>
            </div>
            <div className="list-group col-3 bg-dark border">
              <button className="list-group-item list-group-item-action bg-dark d-flex justify-content-between">
                <span className="text-white">Status </span>
                <span className="text-info">{movie.status}</span>
              </button>
              <button className="list-group-item list-group-item-action bg-dark d-flex justify-content-between">
                <span className="text-white">Original langauge </span>
                <span className="text-info">{movie.original_language}</span>
              </button>
              <button className="list-group-item list-group-item-action bg-dark d-flex justify-content-between align-items-center">
                <span className="text-white">Budget </span>
                <span className="text-info">${movie.budget}</span>
              </button>
              <button className="list-group-item list-group-item-action bg-dark d-flex justify-content-between">
                <span className="text-white">Revenue </span>
                <span className="text-info">${movie.revenue}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <span>Movie details not found</span>
      )}
    </div>
  );
};

export default MovieDetails;
