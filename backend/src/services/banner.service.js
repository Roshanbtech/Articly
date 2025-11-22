// banner.service.js
import { getPagination } from "../utils/pagination.js";
import * as bannerRepo from "../repositories/banner.repo.js";

export const createBanner = async (payload, adminId, imageUrl) => {
  const { title, description, link } = payload;

  const banner = await bannerRepo.createBanner({
    title,
    description: description || "",
    imageUrl,
    link: link || "",
    createdBy: adminId,
    isActive: true,
  });

  return banner;
};

export const listAdminBanners = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = {};

  // 1) Status filter (coming as string "true"/"false" from frontend)
  if (typeof query.isActive === "string") {
    if (query.isActive === "true") {
      filter.isActive = true;
    } else if (query.isActive === "false") {
      filter.isActive = false;
    }
  }

  // 2) Search filter (title/description)
  if (query.search && query.search.trim().length > 0) {
    const search = query.search.trim();
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // 3) Query DB with the same filter for data and total
  const [banners, total] = await Promise.all([
    bannerRepo.findManyAdmin(filter, { skip, limit }),
    bannerRepo.count(filter),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return { banners, total, page, limit, totalPages };
};

export const listActiveBanners = async () => {
  const banners = await bannerRepo.findActive();
  return banners;
};

export const getBannerById = async (id) => {
  const banner = await bannerRepo.findById(id);
  if (!banner) throw { status: 404, message: "Banner not found" };
  return banner;
};

export const updateBanner = async (id, payload, imageUrl) => {
  const updateData = { ...payload };

  if (imageUrl) {
    updateData.imageUrl = imageUrl;
  }

  const updated = await bannerRepo.updateById(id, updateData);
  if (!updated) throw { status: 404, message: "Banner not found" };

  return updated;
};

export const toggleBanner = async (id) => {
  const banner = await bannerRepo.findById(id);
  if (!banner) throw { status: 404, message: "Banner not found" };

  banner.isActive = !banner.isActive;
  await banner.save();
  return banner;
};
