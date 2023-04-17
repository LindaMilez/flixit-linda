import apiClient from "../utils/apiClient";

export const addLike = async (movie) => {
  await apiClient({
    method: "POST",
    url: "/app/likes",
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

export const removeLike = async (movieId) => {
  await apiClient({
    method: "DELETE",
    url: "/app/likes",
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
