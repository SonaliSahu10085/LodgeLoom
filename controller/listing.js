const Listing = require("../models/listings");

module.exports.allListing = async (req, res, next) => {
  const listings = await Listing.find();
  res.render("Listings/index", { listings });
};

module.exports.createListing = async (req, res, next) => {
  const { path: url, filename } = req.file;
  const listing = new Listing(req.body.listing);
  listing.owner = req.user._id;
  listing.image = { filename, url };
  await listing.save();
  req.flash("success", "Listing created!");
  res.redirect("/listings");
};

module.exports.renderNewForm = (req, res, next) => {
  res.render("Listings/new");
};

module.exports.showListing = async (req, res, next) => {
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
};

module.exports.updateListing = async (req, res, next) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, {
    ...req.body.listing,
  });
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res, next) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing doesn't exist!");
    res.redirect("/listings");
    return;
  }
  res.render("Listings/edit", { listing });
};
