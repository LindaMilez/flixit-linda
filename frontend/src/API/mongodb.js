import apiClient from "../utils/apiClient";

export const addFavourite = async (movie) => {
  await apiClient({
    method: "POST",
    url: "/app/favourites",
    data: movie,
  });
};

export const addWatchList = async (movie) => {
  await apiClient({
    method: "POST",
    url: "/app/watchlist",
    data: movie,
  });
};

export const removeFavourite = async (movieId) => {
  await apiClient({
    method: "DELETE",
    url: "/app/favourites",
    data: { movieId },
  });
};

export const removeWatchList = async (movieId) => {
  await apiClient({
    method: "DELETE",
    url: "/app/watchlist",
    data: { movieId },
  });
};

export const setMovieRating = async (movieId, rating) => {
  const response = await apiClient({
    method: "POST",
    url: "/app/rating",
    data: { movieId, rating },
  });
  return response.data;
}

export const getMovieRating = async (movieId) => {
  const respose = await apiClient({
    method: "GET",
    url: `/app/rating/${movieId}`
  });
  return respose.data;
}