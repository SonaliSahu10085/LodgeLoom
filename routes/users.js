const express = require("express");
const router = express.Router();
const User = require("../models/users");
const wrapAsync = require("../utils/wrapAsync");
const { validateSignupUser } = require("../utils/serverValidation");
const { saveRedirectUrl } = require("../utils/middleware");
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
      const newUser = new User({
        email,
        username,
      });

      const registeredUser = await User.register(newUser, password);
      // console.log(registeredUser);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", `Hi ${username}! Welcome back to BookMyStay!`);
        res.redirect("/listings");
      });
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
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(async function (req, res) {
    console.log(req.user);
    req.flash(
      "success",
      `Hi ${req.user.username}! Welcome back to BookMyStay!`
    );
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  })
);

/* Get Logout */
router.get("/logout", function (req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you are logged out!");
    res.redirect("/listings");
  });
});

module.exports = router;
