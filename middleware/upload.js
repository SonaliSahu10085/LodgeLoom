const multer = require("multer");
const path = require("path");
const ExpressError = require("../utils/ExpressError");
const { storage } = require("../cloudConfig");

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extName = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(
      new ExpressError(400, "Only JPEG, JPG, WEBP and PNG files are allowed. Limit 50KB"),
      false
    );
  }
};

// Upload middleware with limits
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 }, // 50KB limit
  fileFilter,
});

module.exports = upload;
