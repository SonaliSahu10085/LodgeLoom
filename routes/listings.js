const express = require("express");
const router = express.Router();
const Listing = require("../models/listings");
const Review = require("../models/reviews");
const wrapAsync = require("../utils/wrapAsync");

const {validateListing, validateReview} = require("../utils/serverValidation");

/* Index Route */
router.get(
  "/",
  wrapAsync(async (req, res, next) => {
    const listings = await Listing.find();
    res.render("Listings/index", { listings });
  })
);

/* Create Route - POST /listings */
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const listing = new Listing(req.body.listing);
    // console.log(listing);
    await listing.save();
    res.redirect("/listings");
  })
);

/* New Route */
router.get("/new", (req, res, next) => {
  res.render("Listings/new");
});

/* Show Route */
router.get(
  "/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("Listings/show", { listing });
  })
);

/* Update Route */
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, {
      ...req.body.listing,
    });
    res.redirect(`/listings/${id}`);
  })
);

/* Delete Route */
router.delete(
  "/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

/* Edit Route */
router.get(
  "/:id/edits",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("Listings/edit", { listing });
  })
);

/* Post Review Route */
router.post(
  "/:id/reviews",
  validateReview,
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const newReview = new Review(req.body.review);
    const listing = await Listing.findById(id);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${id}`);
  })
);

/* Delete Review Route */
router.delete(
  "/:id/reviews/:review_id",
  wrapAsync(async (req, res, next) => {
    const { id, review_id } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: review_id } });
    await Review.findByIdAndDelete(review_id); 
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
