const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listings");
const Review = require("../models/reviews");
const wrapAsync = require("../utils/wrapAsync");
const { validateReview } = require("../utils/serverValidation");
const { isLoggedIn, isReviewAuthor } = require("../utils/middleware");
const reviewController = require("../controller/review")

/* Create Review Route */
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

/* Delete Review Route */
router.delete(
  "/:review_id",
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
