import { initialState as moviesState } from "../store/movieReducer";
import apiClient, { setReqHeader } from "./apiClient";

const getPersonalData = async () => {
  const likes = await apiClient({
    method: "GET",
    url: "/app/likes"
  });
  const watchlist = await apiClient({
    method: "GET",
    url: "/app/watchlist"
  });
  return { likes: likes.data, watchlist: watchlist.data };
}

export const preLoadState = async () => {
  const preState = {};
  const user = JSON.parse(localStorage.getItem("user"));
  const refreshToken = localStorage.getItem("refreshToken");
  if (refreshToken) {
    try {
      const response = await apiClient({
        method: "POST",
        url: "/auth/token",
        data: { refreshToken },
      });
      const { authToken } = response.data;
      setReqHeader('Authorization', authToken);
      if (user) {
        preState.user = user;
      }
      const { likes, watchlist } = await getPersonalData();
      preState.movies = moviesState;
      preState.movies.likes = likes;
      preState.movies.watchlist = watchlist;
    } catch (error) {
      localStorage.removeItem("user");
      localStorage.removeItem("refreshToken");
    }
  }
  return preState;
};
