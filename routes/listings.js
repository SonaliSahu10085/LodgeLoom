const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { validateListing } = require("../utils/serverValidation");
const { isLoggedIn, isOwner } = require("../utils/middleware");
const listingController = require("../controller/listing");
// const multer = require("multer");
// const { storage } = require("../cloudConfig");
// const upload = multer({ storage });
const upload = require('../middleware/upload');

/* Create Route - POST /listings */
router.post(
  "/",
  isLoggedIn,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.createListing)
);

/* New Route */
router.get("/new", isLoggedIn, listingController.renderNewForm);

/* Show Route */
router.get(
  "/:id",
  wrapAsync(listingController.showListing)
);

/* Update Route */
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.updateListing)
);

/* Delete Route */
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
);

/* Edit Route */
router.get(
  "/:id/edits",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
