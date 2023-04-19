const express = require("express");
const bodyParser = require("body-parser");
const { corsWithOptions } = require("../cors");
const {
  registerUser,
  signInUser,
  signOutUser,
  refreshToken,
} = require("../controllers/auth");

const authRouter = express.Router();

authRouter.use(bodyParser.json());

/**
 * 1. Extract new user details
 * 2. Validate the new user details
 * 3. Check for existing user with same email
 * 4. Save the user to users collection and return success response.
 * 5. If already existing, respond with specific error code and message.
 * 6. If any other error occurred, respond with specific error code and message.
 */
authRouter
  .route("/register")  //  http://localhost:8080/api/auth/register
  .options(corsWithOptions, (req, res) => res.sendStatus(200))
  .post(corsWithOptions, registerUser);

/**
 * validate the user record.
 * check user email and password matches with any record in users collection.
 * if match found, create response object with user details object, access token and refresh token.
 * save the refresh token to some database collection.
 * set expires time to 10 mins to access token and 15 days for refresh token. / until logout manually.
 * send success response with details.
 * set cookies for access token and refresh token
 * else, send fail response with error.
 */
authRouter
  .route("/signin") //  http://localhost:8080/api/auth/signin
  .options(corsWithOptions, (_, res) => {
    res.sendStatus(200);
  })
  .post(corsWithOptions, signInUser);

authRouter
  .route("/signout")
  .options(corsWithOptions, (_, res) => {
    res.sendStatus(200);
  })
  .post(corsWithOptions, signOutUser);

/**
 * Extract user access token, refresh token from request cookies. / request data.
 * if refresh token is found on database, generate accesstoken and respond back with cookies with accesstoken.
 */
authRouter
  .route("/token")
  .options(corsWithOptions, (_, res) => {
    res.sendStatus(200);
  })
  .post(corsWithOptions, refreshToken);

module.exports = authRouter;
