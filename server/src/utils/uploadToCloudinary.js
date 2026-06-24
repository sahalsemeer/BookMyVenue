const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadToCloudinary = (filebuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "venues",
      },
      (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      },
    );
    streamifier.createReadStream(filebuffer).pipe(stream);
  });
};

module.exports = uploadToCloudinary;
