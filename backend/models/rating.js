var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Rating = new Schema(
  {
    userId: {
      type: String,
      required: true,
      default: "",
    },
    movieId: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Rating", Rating);
