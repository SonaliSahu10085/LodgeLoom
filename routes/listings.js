const express = require("express");
const router = express.Router();
const Listing = require("../models/listings");
const wrapAsync = require("../utils/wrapAsync");
const { validateListing } = require("../utils/serverValidation");
const { isLoggedIn, isOwner } = require("../utils/middleware");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

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
  isLoggedIn,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(async (req, res, next) => {
    const { path: url, filename } = req.file;
    const listing = new Listing(req.body.listing);
    listing.owner = req.user._id;
    listing.image = { filename, url };
    await listing.save();
    req.flash("success", "Listing created!");
    res.redirect("/listings");
  })
);

/* New Route */
router.get("/new", isLoggedIn, (req, res, next) => {
  res.render("Listings/new");
});

/* Show Route */
router.get(
  "/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    // console.log(listing.reviews);
    if (!listing) {
      req.flash("error", "Listing doesn't exist!");
      res.redirect("/listings");
      return;
    }
    res.render("Listings/show", { listing });
  })
);

/* Update Route */
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, {
      ...req.body.listing,
    });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  })
);

/* Delete Route */
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  })
);

/* Edit Route */
router.get(
  "/:id/edits",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing doesn't exist!");
      res.redirect("/listings");
      return;
    }
    res.render("Listings/edit", { listing });
  })
);

module.exports = router;
