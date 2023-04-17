var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Likes = new Schema(
  {
    movieId: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: "",
    }
  },
  {
    timestamps: true,
    strict: false
  }
);

module.exports = mongoose.model("Likes", Likes);