require("dotenv").config();  // process.env.ACCESS_TOKEN_SECRET
const express = require("express");
const path = require('path');
const { default: mongoose } = require("mongoose");
const cookieParser = require('cookie-parser');

const app = express();
const authRouter = require("./routes/authRouter");
const dataRouter = require("./routes/dataRouter");

mongoose.set('strictQuery', true);
const dbUrl = process.env.MONGO_DB_URL;
const conn = mongoose.connect(dbUrl);
conn.then((db) => {
  console.log('Connected to database server.');
}, (err) => {
  console.log(err);
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use("/api/auth", authRouter);
app.use("/api/app", dataRouter);
app.use("/", express.static(path.join(__dirname, 'frontend/build')));

// catch 404 and forward to error handler
app.use(function (_, _, next) {
  next(createError(404));
});

// error handler
app.use(function (err, _, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.end(err.message);
});

app.listen(process.env.PORT || 3000);
