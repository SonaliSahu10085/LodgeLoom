const User = require("../models/users");

module.exports.renderSignupForm = (req, res) => {
  res.render("Users/signup.ejs");
};

module.exports.signup = async function (req, res, next) {
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
};

module.exports.renderLoginForm = (req, res) => {
  res.render("Users/login.ejs");
};

module.exports.afterAuthentication = async function (req, res) {
  console.log(req.user);
  req.flash("success", `Hi ${req.user.username}! Welcome back to BookMyStay!`);
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you are logged out!");
    res.redirect("/listings");
  });
};
