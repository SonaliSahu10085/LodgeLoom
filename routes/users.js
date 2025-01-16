const express = require("express");
const router = express.Router();
const User = require("../models/users");
const wrapAsync = require("../utils/wrapAsync");
const { validateSignupUser } = require("../utils/serverValidation");
const { saveRedirectUrl } = require("../utils/middleware");
const userController = require("../controller/user");
const passport = require("passport");
const listingController = require("../controller/listing");

/* Index Route */
router.get("/", wrapAsync(listingController.allListing));
/* Get Signup Page */
router.get("/signup", userController.renderSignupForm);

router.post("/signup", validateSignupUser, wrapAsync(userController.signup));

/* Get Login Page */
router.get("/login", userController.renderLoginForm);

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(userController.afterAuthentication)
);

/* Get Logout */
router.get("/logout", userController.logout);

module.exports = router;
