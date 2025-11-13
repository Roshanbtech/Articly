export const publicUserDTO = (user) => ({
  id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
  preferences: user.preferences,
  profileImage: user.profileImage,
});
