// src/types/banner.types.ts
export interface Banner {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  link?: string;
}

export interface AdminBanner extends Banner {
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface AdminBannerListResponse {
  success: boolean;
  banners: AdminBanner[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Public active banners (for user side if/when needed)
export interface BannerListResponse {
  success: boolean;
  banners: Banner[];
}
