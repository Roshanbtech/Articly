export const bannerDTO = (banner) => {
  if (!banner) return null;

  return {
    id: banner._id,
    title: banner.title,
    description: banner.description,
    imageUrl: banner.imageUrl,
    link: banner.link,
    isActive: banner.isActive,
    createdAt: banner.createdAt,
    updatedAt: banner.updatedAt,
  };
};
