const express = require("express");
const router = express.Router();
const User = require("../models/users");
const wrapAsync = require("../utils/wrapAsync");
const { validateSignupUser } = require("../utils/serverValidation");
const passport = require("passport");

/* Get Signup Page */
router.get("/signup", function (req, res) {
  res.render("Users/signup.ejs");
});

router.post(
  "/signup",
  validateSignupUser,
  wrapAsync(async function (req, res, next) {
    try {
      const { username, email, password } = req.body;
      const fakeUser = new User({
        email,
        username,
      });

      const registeredUser = await User.register(fakeUser, password);
      console.log(registeredUser);
      req.flash(
        "success",
        "Signup Successfully! Please Login to your account."
      );
      res.redirect("/login");
    } catch (e) {
      req.flash("error", `${e.message}.`);
      res.redirect("/signup");
    }
  })
);

/* Get Login Page */
router.get("/login", function (req, res) {
  res.render("Users/login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(async function (req, res) {
    req.flash("success", `Hi, Welcome to BookMyStay!`);
    res.redirect("/listings");
  })
);

module.exports = router;
