import axios from "axios";

// Create instance called instance
const apiClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {},
});

export const setReqHeader = (key, val) => {
  apiClient.defaults.headers.common[key] = `Bearer ${val}`;
};

export const removeReqHeader = (key) => {
  apiClient.defaults.headers.common[key] = "";
};

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    const originalRequest = error.config;
    if (
      error?.response?.status === 401 &&
      originalRequest?.url === "/auth/token"
    ) {
      window.location.href = '/login';
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      return apiClient
        .post("/auth/token", { refreshToken: refreshToken })
        .then((res) => {
          if (res.status === 201) {
            const { authToken } = res.data;
            setReqHeader('Authorization', authToken);
            originalRequest.headers['Authorization'] = `Bearer ${authToken}`;
            return apiClient(originalRequest);
          }
        });
    }
    return Promise.reject(error);
  }
);

export default apiClient;
