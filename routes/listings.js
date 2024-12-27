const express = require("express");
const router = express.Router();
const Listing = require("../models/listings");

/* Index Route */
router.get("/", async (req, res, next) => {
  const listings = await Listing.find();
  res.render("Listings/index", { listings });
});

/* Create Route */
router.post("/", async (req, res, next) => {
  const listing = new Listing(req.body);
  console.log(listing);
  await listing.save();
  res.redirect("/listings");
});

/* New Route */
router.get("/new", async (req, res, next) => {
  res.render("Listings/new");
});

/* Show Route */
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("Listings/show", { listing });
});

/* Update Route */
router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body });
  // console.log(listing)
  res.redirect(`/listings/${id}`);
});

/* Delete Route */
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndDelete(id);
  // console.log(listing)
  res.redirect("/listings");
});

/* Edit Route */
router.get("/:id/edits", async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("Listings/edit", { listing });
});

module.exports = router;
