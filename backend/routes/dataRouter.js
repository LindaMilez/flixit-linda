const express = require("express");
const bodyParser = require("body-parser");
const { corsWithOptions } = require("../cors");
const { getData, updateUserInfo, setFavourite, addToWatch, getFavourites, getWatchList, getUserInfo, removeFavourite, removeWatchList } = require("../controllers/data");
const { isSignedIn } = require("../controllers/auth");

const dataRouter = express.Router();

dataRouter.use(bodyParser.json());

dataRouter
  .route("/data")
  .options(corsWithOptions, (_, res) => res.sendStatus(200))
  .get(corsWithOptions, isSignedIn, getData);
  
  dataRouter.route('/favourites')
  .options(corsWithOptions, (req, res) => res.sendStatus(200))
  .get(corsWithOptions, isSignedIn, getFavourites)
  .post(corsWithOptions, isSignedIn, setFavourite)
  .delete(corsWithOptions, isSignedIn, removeFavourite);

dataRouter.route('/watchlist')
  .options(corsWithOptions, (req, res) => res.sendStatus(200))
  .get(corsWithOptions, isSignedIn, getWatchList)
  .post(corsWithOptions, isSignedIn, addToWatch)
  .delete(corsWithOptions, isSignedIn, removeWatchList);

dataRouter.route('/user')
  .options(corsWithOptions, (req, res) => res.sendStatus(200))
  .get(corsWithOptions, isSignedIn, getUserInfo)
  .put(corsWithOptions, isSignedIn, updateUserInfo);


module.exports = dataRouter;
