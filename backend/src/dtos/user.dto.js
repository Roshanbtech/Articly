import cloudinary from "../config/cloudinary.js";

export const publicUserDTO = (user) => ({
  id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
  // preferences: user.preferences,
  // profileImage: user.profileImage,
});

export const articlyUserDTO = (user) => {
  let signedImageUrl = "";
  if (user.profileImage?.publicId) {
    signedImageUrl = cloudinary.url(user.profileImage.publicId, {
      secure: true,
      sign_url: true,
      version: user.profileImage.version,
      expires_at: Math.floor(Date.now() / 1000) + 3600, 
    });
  }
   return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    dob: user.dob,
    preferences: user.preferences,
    profileImage: signedImageUrl,
    blockedArticles: user.blockedArticles,
    isBlocked: user.isBlocked
   }
}