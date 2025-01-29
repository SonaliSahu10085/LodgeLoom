const ExpressError = require("./ExpressError");
const { listingSchema, reviewSchema, userSignupSchema} = require("../schema");

//Server side validation middleware

module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details[0].message;
    req.flash("error", errMsg);
    return res.status(400).redirect(`${req.originalUrl}`);
    // throw new ExpressError(400, errMsg); 
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details[0].message;
    throw new ExpressError(400, errMsg);
  }
  next();
};

module.exports.validateSignupUser = (req, res, next) => {
  const { error } = userSignupSchema.validate(req.body);
  if (error) {
    const errMsg = error.details[0].message;
    throw new ExpressError(400, errMsg);
  }
  next();
};