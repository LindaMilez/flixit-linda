var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Enquiry = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    query: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("enquiry", Enquiry);
