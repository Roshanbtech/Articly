import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed"));
  }
  cb(null, true);
};

const limits = {
  fileSize: 2 * 1024 * 1024, 
};

export const uploadSingleImage = (fieldName) =>
  multer({ storage, fileFilter, limits }).single(fieldName);

export const uploadMultipleImages = (fieldName, maxCount) =>
  multer({ storage, fileFilter, limits }).array(fieldName, maxCount);
