const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listings");
const Review = require("../models/reviews");
const wrapAsync = require("../utils/wrapAsync");
const { validateReview } = require("../utils/serverValidation");

/* Create Review Route */
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const newReview = new Review(req.body.review);
    const listing = await Listing.findById(id);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Review Created!");
    res.redirect(`/listings/${id}`);
  })
);

/* Delete Review Route */
router.delete(
  "/:review_id",
  wrapAsync(async (req, res, next) => {
    const { id, review_id } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: review_id } });
    await Review.findByIdAndDelete(review_id);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
