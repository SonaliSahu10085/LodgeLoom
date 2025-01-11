const mongoose = require("mongoose");
const { Schema } = mongoose;
const Review = require("./reviews.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default: "https://img.freepik.com/free-photo/3d-render-house-countryside_1048-13116.jpg?ga=GA1.1.1831672475.1736491003&semt=ais_hybrid",
    set: (imageLink) => (imageLink ? imageLink : "https://img.freepik.com/free-photo/3d-render-house-countryside_1048-13116.jpg?ga=GA1.1.1831672475.1736491003&semt=ais_hybrid"),
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

//Mongoose Post Middleware
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing.reviews.length) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
