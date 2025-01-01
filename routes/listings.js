const express = require("express");
const router = express.Router();
const Listing = require("../models/listings");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const validateListing = require('../utils/validateListing')

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
    const listing = await Listing.findById(id);
    res.render("Listings/show", { listing });
  })
);

/* Update Route */
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    // if (!req.body.listing) {
    //   throw new ExpressError(400, "Send valid data for listing.");
    // }
    const listing = await Listing.findByIdAndUpdate(id, {
      ...req.body.listing,
    });
    // console.log(listing)
    res.redirect(`/listings/${id}`);
  })
);

/* Delete Route */
router.delete(
  "/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndDelete(id);
    // console.log(listing)
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

// router.use(function (err, req, res, next) {
//   res.send("Some Server error.");
// });

module.exports = router;
