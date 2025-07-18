require("dotenv/config");
const moment = require("moment");
const path = require('path');
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const originalName = path.parse(file.originalname).name; // filename without extension
    const ext = path.extname(file.originalname); // file extension like .jpg

    return {
      folder: "LodgeLoom",
      allowedFormats: ["webp", "png", "jpeg", "jpg"],
      public_id: `${moment().format(
        "DD-MMM-YYYY-hh-mm-ss"
      )}-${originalName}${ext}`,
    };
  },
});

module.exports = {
  cloudinary,
  storage,
};
