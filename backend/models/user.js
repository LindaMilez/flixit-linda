var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var User = new Schema(
  {
    username: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    password: {
      type: String,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    }, 
    country: {
      type: String,
    }, 
    postalCode: {
      type: String,
    },
    userId: {
      type: String
    },
    picture: {
      type: String
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", User);
