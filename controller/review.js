const Listing = require("../models/listings");
const Review = require("../models/reviews");

module.exports.createReview = async (req, res, next) => {
  const { id } = req.params;
  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  const listing = await Listing.findById(id);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "Review Created!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyReview = async (req, res, next) => {
  const { id, review_id } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: review_id } });
  await Review.findByIdAndDelete(review_id);
  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
};
