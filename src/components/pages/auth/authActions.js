import { actionTypes } from "../../../store/movieReducer";
import { authActions } from "../../../store/userReducer";
import apiClient, { removeReqHeader, setReqHeader } from "../../../utils/apiClient";

export const registerUser = async (user) => {
  try {
    const registeredUser = await apiClient({
      method: "POST",
      url: "/auth/register",
      data: user,
    });
    return registeredUser;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export const signInUser = (userData) => async (dispatch) => {
  dispatch({ type: authActions.AUTH_LOGIN_REQUEST });
  try {
    const signInDetails = await apiClient({
      method: "POST",
      url: "/auth/signin",
      data: userData,
    });
    const { user, likes, watchlist, refreshToken, authToken } = signInDetails.data;
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("refreshToken", refreshToken);
    setReqHeader('Authorization', authToken);
    dispatch({
      type: authActions.AUTH_LOGIN_REQ_SUCCESS,
      payload: {user, refreshToken, authToken},
    });

    dispatch({
      type: actionTypes.SET_PERSONAL_DATA,
      payload: {
        likes, watchlist
      }
    })

  } catch (error) {
    dispatch({
      type: authActions.AUTH_LOGIN_REQ_FAILED,
      payload: error.response ? error.response.data : error.message,
    });
  }
};

export const checkLoginUserCache = () => (dispatch) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    dispatch({ type: authActions.AUTH_USER_DETAILS_SET, payload: user });
  }
};

export const signOutUser = () => async (dispatch) => {
  localStorage.removeItem("user");
  const refreshToken = localStorage.getItem("refreshToken");
  localStorage.removeItem("refreshToken");
  removeReqHeader('Authorization');
  removeReqHeader('AuthProvider');
  dispatch({ type: authActions.AUTH_USER_SIGNOUT });
  await apiClient({
    method: "post",
    url: "/auth/signout",
    data: { refreshToken }
  });
};