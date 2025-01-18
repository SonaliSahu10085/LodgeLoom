require("dotenv/config");
const createError = require("http-errors");
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/users.js");

const userRouter = require("./routes/users");
const listingsRouter = require("./routes/listings");
const reviewRouter = require("./routes/reviews");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

(async function () {
  await mongoose.connect(process.env.MONGO_ATLAS_URL);
  // await mongoose.connect("mongodb://127.0.0.1:27017/bookmystay");
})()
  .then(() => console.log("Db connection successful"))
  .catch((err) => console.log("Db not connected.", err));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

// app.use(logger("dev"));
// app.use(cookieParser());

const MongoStoreOptions = {
  mongoUrl: process.env.MONGO_ATLAS_URL,
  crypto: {
    secret: process.env.SESSION_SECRET,
  }
};
const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 14 * 24 * 60 * 60 * 1000,
    maxAge: 14 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
  store: MongoStore.create(MongoStoreOptions),
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//handling flash msgs middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  res.locals.searchQuery = "";
  next();
});

app.use("/", userRouter);
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewRouter);

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
