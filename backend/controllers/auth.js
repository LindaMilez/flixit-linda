const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Token = require("../models/authTokens");
const { getPersonalData } = require("./data");

let { AUTH_TOKEN_EXPIRE_TIME, REFRESH_TOKEN_EXPIRE_TIME } = process.env;

function generateAuthToken(user, secret, options) {
  return jwt.sign(user, secret, options);
}

const validateUser = (user) => {
  const { username, email, password } = user;
  let err = undefined;
  if (!username) {
    err = new Error("Please provide username");
    err.status = 400;
  } else if (!email) {
    err = new Error("Please provide email");
    err.status = 400;
  } else if (!password) {
    err = new Error("Please provide password");
    err.status = 400;
  }
  return new Promise((res, rej) => (err ? rej(err) : res()));
};

const checkExistingUser = (user) => {
  const { email } = user;
  return new Promise((resolve, reject) => {
    return User.findOne({ email: email })
      .then((matchingUser) => {
        if (matchingUser) {
          const err = new Error(
            `Email was already registered. Please proceed to signin.`
          );
          err.status = 400;
          reject(err);
        } else {
          resolve();
        }
      })
      .catch((error) => {
        const err = new Error(
          `Error while checking existing user ${error.message}`
        );
        err.status = 400;
        reject(err);
      });
  });
};

const registerUser = (req, res, next) => {
  let user = req.body;
  validateUser(user)
    .then(() => checkExistingUser(user))
    .then(() => {
      return User.create(user);
    })
    .then((createdUser) => {
      const { username, _id, email } = createdUser;
      res.statusCode = 201;
      res.setHeader("content-type", "application/json");
      res.json({ username, email, _id });
    })
    .catch((error) => {
      const err = new Error(error.message);
      err.status = 500;
      next(err);
    });
};

const signInUser = (req, res, next) => {
  const user = req.body;
  const { email, password } = user;
  let signInUser = {};
  console.log('RAM:', { email, password });
  User.findOne({ email, password })
    .then((matchingUser) => {
      signInUser = matchingUser;
      const { username, email, _id } = matchingUser;
      const refreshToken = generateAuthToken(
        { username, email, _id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: `${REFRESH_TOKEN_EXPIRE_TIME}s` }
      );
      return Token.create({ _userId: _id, token: refreshToken });
    })
    .then(async (tokenDoc) => {
      const { token: refreshToken } = tokenDoc;
      const { username, email, _id } = signInUser;
      const { likes, watchlist } = await getPersonalData(_id);
      const authToken = generateAuthToken(
        { username, email, _id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: `${AUTH_TOKEN_EXPIRE_TIME}s` }
      );
      res.statusCode = 200;
      res.json({ user: { username, email, _id }, likes, watchlist, refreshToken, authToken });
    })
    .catch((_) => {
      const err = new Error(
        "Login failed. Please provide valid details to login."
      );
      err.status = 403;
      next(err);
    });
};

const signOutUser = (req, res) => {
  const { refreshToken } = req.body;
  Token.deleteOne({ token: refreshToken })
    .then(() => {
      res.sendStatus(200);
    })
    .catch(() => {
      res.sendStatus(500);
    });
};

const isSignedIn = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(401);
    req.user = user;
    next();
  });
};

const refreshToken = (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken == null) return res.sendStatus(401);
  Token.findOne({ token: refreshToken })
    .then((tokenDoc) => {
      if (!tokenDoc) {
        throw new Error("Token expired");
      } else {
        return new Promise((resolve, reject) => {
          jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, user) => {
              if (err) reject(err);
              resolve(user);
            }
          );
        });
      }
    })
    .then((user) => {
      return User.findOne({ _id: user._id });
    }).then((user) => {
      const { iat, exp, ...restUser } = user;
      const authToken = generateAuthToken(
        restUser,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: `${AUTH_TOKEN_EXPIRE_TIME}s` }
      );
      res.statusCode = 201;
      res.json({ authToken });
    })
    .catch(() => {
      res.sendStatus(401);
    });
};

module.exports = {
  registerUser,
  signInUser,
  signOutUser,
  isSignedIn,
  refreshToken,
};
