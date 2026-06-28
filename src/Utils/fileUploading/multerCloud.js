import multer from "multer";
import ApiError from "../ErrorHandling/ApiError.js";

export const fileValidation = {
  images: ["image/png", "image/jpeg", "image/jpg"],
};

const fileFilter = (req, file, cb) => {
  if (!fileValidation.images.includes(file.mimetype)) {
    return cb(new ApiError("Only image files are allowed.", 400), false);
  }
  cb(null, true);
};

const uploadCloud = () =>
  multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  });

export default uploadCloud;
