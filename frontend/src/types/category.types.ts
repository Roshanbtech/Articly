export interface Category {
  id: string;
  name: string;
  description?: string;
  iconUrl?: string;
}

export interface CategoryListResult {
  categories: Category[];
}

//for admin category listings
export interface AdminCategory extends Category {
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface AdminCategoryListResponse {
  success: boolean;
  categories: AdminCategory[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}