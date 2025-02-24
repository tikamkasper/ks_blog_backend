const cloudinary = require("cloudinary").v2;
const { CustomError } = require("./CustomError.js");
const fs = require("fs");

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = require("../config");

// Cloudinary configuration
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

exports.uploadToCloudinary = async (filename, path, next) => {
  return cloudinary.uploader
    .upload(path, {
      public_id: `${Date.now()}_${filename}`,
      folder: "ks_blog/images",
      // width: 150,
      // height: 150,
      // crop: "scale",
    })
    .then((result) => {
      // Remove file from public/temp folder
      fs.unlinkSync(path);
      return {
        url: result.secure_url,
        public_id: result.public_id,
      };
    })
    .catch((error) => {
      // Remove file from publice/temp folder
      fs.unlinkSync(path);
      next(
        new CustomError({
          userMessage: "Oops! Something went wrong. Please try again.",
          devMessage: " Error uploading image to Cloudinary",
          statusCode: 500,
        })
      );
    });
};
