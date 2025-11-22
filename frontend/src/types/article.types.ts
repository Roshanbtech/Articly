// src/types/article.types.ts
export interface Article {
  id: string;
  title: string;
  description: string;
  images: string[];
  tags: string[];
  category: string;             
  categoryName: string | null;  
  author: string;
  authorName?: string | null;
  likesCount: number;
  dislikesCount: number;
  blocksCount: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleListPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ArticleListResponse {
  success: boolean;
  articles: Article[];
  pagination: ArticleListPagination;
}

export interface CreateArticlePayload {
  title: string;
  description: string;
  category: string;
  tags: string[];
  images?: File[];
  isPublished?: boolean;
}

export interface UpdateArticlePayload {
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
  images?: File[];
  isPublished?: boolean;
}
