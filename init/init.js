const mongoose = require("mongoose");
let { data } = require("./data.js");
const Listing = require("../models/listings.js");

const DB_NAME = "bookmystay";
const MONGO_URL = `mongodb://127.0.0.1:27017/${DB_NAME}`;

main()
  .then(() => console.log("Db connection successful"))
  .catch((err) => console.log("Db not connected."));

async function main() {
  await mongoose.connect(MONGO_URL);
}

async function init() {
  await Listing.deleteMany({});
  data = data.map((obj)=>({...obj, owner: '677fe13e51f8d9512ce0b81e'}))
  await Listing.insertMany(data);
  console.log("Database Initialized..");
}

init();
