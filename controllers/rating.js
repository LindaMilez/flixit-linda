const Rating = require("../models/rating");

const setMovieRating = (req, res, next) => {
  const { movieId, rating } = req.body;
  const userId = req.user._doc._id;
  let avgRating = {};
  Rating.findOne({ movieId: movieId, userId: userId })
    .then((rt) => {
      if (!rt) {
        return Rating.create({
          userId: userId,
          movieId: movieId,
          rating: rating,
        });
      }
      return Rating.findOneAndUpdate(
        { userId: userId, movieId: movieId },
        { rating: rating }
      );
    })
    .then(() =>
      Rating.aggregate([
        { $match: { movieId: movieId } },
        { $group: { _id: movieId, average: { $avg: "$rating" } } },
      ])
    )
    .then((result) => {
      avgRating = result;
      return Rating.findOne({ userId: userId, movieId: movieId });
    })
    .then((rt) => {
      res.statusCode = 200;
      res.setHeader("content-type", "application/json");
      res.json({ rating: rt, aggregate: avgRating });
    })
    .catch((error) => {
      const err = new Error(error.message);
      err.status = 500;
      next(err);
    });
};

const getMovieRating = (req, res, next) => {
  const { movieId } = req.params;
  let userId;
  if (req.user) {
    userId = req.user._doc._id;
  }
  let avgRating = {};
  Rating.aggregate([
    { $match: { movieId: movieId } },
    { $group: { _id: movieId, average: { $avg: "$rating" } } },
  ])
    .then((result) => {
      avgRating = result;
      if (userId) {
        return Rating.findOne({ userId: userId, movieId: movieId });
      } else {
        return new Promise((yes, no) => yes(undefined));
      }
    })
    .then((rt) => {
      res.statusCode = 200;
      res.setHeader("content-type", "application/json");
      res.json({ rating: rt, aggregate: avgRating });
    })
    .catch((error) => {
      const err = new Error(error.message);
      err.status = 500;
      next(err);
    });
};

module.exports = { setMovieRating, getMovieRating };
