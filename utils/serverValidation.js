const ExpressError = require("./ExpressError");
const { listingSchema, reviewSchema } = require("../schema");

//Server side validation middleware

module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details[0].message;
    throw new ExpressError(400, errMsg);
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
