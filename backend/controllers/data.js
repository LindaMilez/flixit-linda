const Likes = require("../models/likes");
const Watchlist = require("../models/watchlist");

const getData = (_, res) => {
  const index = Math.floor(Math.random() * 1000000);
  res.json({ index });
};

const setLike = (req, res, next) => {
  const movie = req.body;
  movie.userId = req.user._doc._id;
  console.log('RAM: LIKE', movie);
  Likes.create(movie)
    .then((movie) => {
      const { _id, title } = movie;
      res.statusCode = 201;
      res.setHeader("content-type", "application/json");
      res.json({ _id, title });
    })
    .catch((error) => {
      const err = new Error(error.message);
      console.log('RAM: ERR: ', error);
      err.status = 500;
      next(err);
    });
};

const getLikes = (req, res, next) => {
  const userId = req.user._doc._id;
  Likes.find({ userId: userId })
    .then((likes) => {
      res.statusCode = 201;
      res.setHeader("content-type", "application/json");
      res.json(likes);
    })
    .catch((error) => {
      const err = new Error(error.message);
      err.status = 500;
      next(err);
    });
};

const removeLike = (req, res, next) => {
  const { movieId } = req.body;
  const userId = req.user._doc._id;
  Likes.findOneAndRemove({ userId: userId, movieId: movieId })
    .then(_ => {
      console.log('RAM: REM: ', _);
      res.statusCode = 200;
      res.setHeader("content-type", "application/json");
      res.json({ success: true });
    })
    .catch(error => {
      console.log('RAM: Error: ', error);
      const err = new Error(error.message);
      err.status = 500;
      next(err);
    });
}


const removeWatchList = (req, res, next) => {
  const { movieId } = req.body;
  const userId = req.user._doc._id;
  Watchlist.findOneAndRemove({ userId: userId, movieId: movieId })
    .then(_ => {
      res.statusCode = 200;
      res.setHeader("content-type", "application/json");
      res.json({ success: true });
    })
    .catch(error => {
      const err = new Error(error.message);
      err.status = 500;
      next(err);
    });
}

const getPersonalData = async (userId) => {
  try {
    const likes = await Likes.find({ userId: userId });
    const watchlist = await Watchlist.find({ userId: userId });
    return { likes, watchlist };
  } catch (error) {
    console.log('Error:', error.message);
    return {};
  }
}

const getWatchList = (req, res, next) => {
  const userId = req.user._doc._id;
  Watchlist.find({ userId: userId })
    .then((watchlist) => {
      res.statusCode = 201;
      res.setHeader("content-type", "application/json");
      res.json(watchlist);
    })
    .catch((error) => {
      const err = new Error(error.message);
      err.status = 500;
      next(err);
    });
};

const addToWatch = (req, res, next) => {
  const movie = req.body;
  movie.userId = req.user._doc._id;

  console.log("RAM: WATCH LIST", movie);
  Watchlist.create(movie)
    .then((movie) => {
      const { _id, title } = movie;
      res.statusCode = 201;
      res.setHeader("content-type", "application/json");
      res.json({ _id, title });
    })
    .catch((error) => {
      const err = new Error(error.message);
      err.status = 500;
      next(err);
    });
};

module.exports = { getData, setLike, getLikes, addToWatch, getWatchList, getPersonalData, removeLike, removeWatchList };
