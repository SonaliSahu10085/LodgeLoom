const ExpressError = require("./ExpressError");
const listingSchema = require("../schema");

//Server side validation middleware
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  }
  next();
};

module.exports = validateListing;
