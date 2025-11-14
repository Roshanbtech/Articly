import cloudinary from "../config/cloudinary.js";

export const uploadBufferToCloudinary = async (buffer, folder = "user_profiles", originalName = "") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: `articly/${folder}`, secure: true },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          publicId: result.public_id,
          version: result.version.toString(),
          originalName,
        });
      }
    ).end(buffer);
  });
};

export const uploadCategoryIconToCloudinary = async (
  buffer,
  folder = "categories",
) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder: `articly/${folder}`, secure: true },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      )
      .end(buffer);
  });
};

