const Favourites = require("../models/favourites");
const User = require("../models/user");
const Watchlist = require("../models/watchlist");

const getData = (_, res) => {
  const index = Math.floor(Math.random() * 1000000);
  res.json({ index });
};

const setFavourite = (req, res, next) => {
  const movie = req.body;
  movie.userId = req.user._doc._id;
  Favourites.findOne({ movieId: movie.movieId, userId: movie.userId })
    .then(fav => {
      if (!fav) {
        return Favourites.create(movie);
      }
      return new Promise((yes, no) => yes(fav));
    })
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

const getFavourites = (req, res, next) => {
  const userId = req.user._doc._id;
  Favourites.find({ userId: userId })
    .then((favourites) => {
      res.statusCode = 200;
      res.setHeader("content-type", "application/json");
      res.json(favourites);
    })
    .catch((error) => {
      const err = new Error(error.message);
      err.status = 500;
      next(err);
    });
};

const removeFavourite = (req, res, next) => {
  const { movieId } = req.body;
  const userId = req.user._doc._id;
  Favourites.findOneAndRemove({ userId: userId, movieId: movieId })
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
    const favourites = await Favourites.find({ userId: userId });
    const watchlist = await Watchlist.find({ userId: userId });
    return { favourites, watchlist };
  } catch (error) {
    return {};
  }
}

const getWatchList = (req, res, next) => {
  const userId = req.user._doc._id;
  Watchlist.find({ userId: userId })
    .then((watchlist) => {
      res.statusCode = 200;
      res.setHeader("content-type", "application/json");
      res.json(watchlist);
    })
    .catch((error) => {
      const err = new Error(error.message);
      err.status = 500;
      next(err);
    });
};

const getUserInfo = (req, res, next) => {
  const userId = req.user._doc._id;
  User.findById(userId)
    .then(user => {
      res.statusCode = 200;
      res.setHeader("content-type", "application/json");
      res.json(user);
    })
    .catch(error => {
      const err = new Error(error.message);
      err.status = 500;
      next(err);
    })
}

const updateUserInfo = (req, res, next) => {
  const userId = req.user._doc._id;
  const userInfo = req.body;
  User.findByIdAndUpdate(userId, { ...userInfo })
    .then(user => {
      res.status = 200;
      res.setHeader("content-type", "application/json");
      res.json(user);
    })
    .catch(error => {
      const err = new Error(error.message);
      err.status = 500;
      next(err);
    })
}

const addToWatch = (req, res, next) => {
  const movie = req.body;
  movie.userId = req.user._doc._id;
  Watchlist.findOne({ movieId: movie.movieId, userId: movie.userId })
    .then(mov => {
      if (!mov) {
        return Watchlist.create(movie);
      }
      return new Promise((yes, no) => yes(mov));
    })
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

module.exports = { getData, setFavourite, getFavourites, addToWatch, getWatchList, getUserInfo, updateUserInfo, getPersonalData, removeFavourite, removeWatchList };
