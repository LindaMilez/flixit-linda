export const authActions = {
  AUTH_LOGIN_REQUEST: "AUTH_LOGIN_REQUEST",
  AUTH_LOGIN_REQ_FAILED: "AUTH_LOGIN_REQ_FAILED",
  AUTH_USER_SIGNOUT: "AUTH_USER_SIGNOUT",
  AUTH_LOGIN_REQ_SUCCESS: "AUTH_LOGIN_REQ_SUCCESS",
  AUTH_USER_DETAILS_GET: "AUTH_USER_DETAILS_GET",
  AUTH_USER_DETAILS_SET: "AUTH_USER_DETAILS_SET",
};

const initState = {
  username: "",
  email: "",
  role: "",
  refreshToken: "",
  loading: false,
  error: "",
};

const reducer = (state = initState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case authActions.AUTH_LOGIN_REQUEST: {
      return { ...state, loading: true, error: "" };
    }
    case authActions.AUTH_USER_SIGNOUT: {
      return { ...initState, loading: false, error: "" };
    }
    case authActions.AUTH_LOGIN_REQ_FAILED: {
      return { ...initState, error: action.payload };
    }
    case authActions.AUTH_LOGIN_REQ_SUCCESS: {
      const { refreshToken, user } = action.payload;
      return { ...newState, ...user, refreshToken, loading: false };
    }
    case authActions.AUTH_USER_DETAILS_SET: { // preload state from cache localStorage.
      newState = { ...newState, ...action.payload };
      return newState;
    }
    default:
      return state;
  }
};

export default reducer;
