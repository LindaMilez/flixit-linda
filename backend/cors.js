const cors = require("cors");

const whiteList = ["http://localhost:4000", "http://localhost:3000", "https://localhost:3000"];

var corsOptionsDelegate = (req, callback) => {
  var corsOptions;
  if (whiteList.indexOf(req.header("origin")) !== -1) {
    corsOptions = { origin: true, credentials: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
