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
