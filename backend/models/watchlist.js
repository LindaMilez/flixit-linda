var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var WatchList = new Schema(
  {
    movieId: {
      type: String,
      require: true
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

module.exports = mongoose.model("WatchList", WatchList);