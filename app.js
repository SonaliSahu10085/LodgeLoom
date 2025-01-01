const createError = require("http-errors");
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const listingsRouter = require("./routes/listings");
const ExpressError = require("./utils/ExpressError");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

(async function () {
  await mongoose.connect("mongodb://127.0.0.1:27017/bookmystay");
})()
  .then(() => console.log("Db connection successful"))
  .catch((err) => console.log("Db not connected."));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.use(logger("dev"));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/listings", listingsRouter);

app.use("*", function (req, res, next) {
  next(new ExpressError(404, "Page not found."));
});

// // // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

//Error handling middleware
app.use(function (err, req, res, next) {
  const { statusCode = 500, message = "Server error" } = err;
  res.status(statusCode).render("error", { message });
});

// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });

module.exports = app;
