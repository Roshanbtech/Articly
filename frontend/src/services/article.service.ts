// src/services/article.service.ts
import axios, { type CancelToken } from 'axios';
import apiClient from '../config/apiClient';
import { ApiClientError } from '../lib/apiClientError';
import type { ApiErrorResponse } from '../types/api.types';
import type {
  Article,
  ArticleListResponse,
  CreateArticlePayload,
  UpdateArticlePayload,
} from '../types/article.types';

const mapArticle = (a: any): Article => {
  const categoryObj =
    a?.category && typeof a.category === 'object' ? a.category : null;

  const authorObj =
    a?.author && typeof a.author === 'object' ? a.author : null;

  return {
    id: a.id ?? a._id,
    title: a.title,
    description: a.description,
    images: Array.isArray(a.images) ? a.images : [],
    tags: Array.isArray(a.tags) ? a.tags : [],

    category: categoryObj?._id ?? a.category ?? '',

    categoryName:
      a.categoryName ??
      (categoryObj && typeof categoryObj.name === 'string'
        ? categoryObj.name
        : null),

    author: authorObj?._id ?? (typeof a.author === 'string' ? a.author : ''),
    authorName:
      a.authorName ??
      (authorObj
        ? [authorObj.firstName, authorObj.lastName].filter(Boolean).join(' ')
        : null),

    likesCount: a.likesCount ?? 0,
    dislikesCount: a.dislikesCount ?? 0,
    blocksCount: a.blocksCount ?? 0,
    isPublished: Boolean(a.isPublished),
    createdAt: a.createdAt ?? '',
    updatedAt: a.updatedAt ?? '',
  };
};

const toApiClientError = (err: unknown): ApiClientError => {
  if (err instanceof ApiClientError) return err;

  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const data = err.response?.data as ApiErrorResponse | undefined;
    return new ApiClientError(
      data?.message || err.message || 'Request failed',
      status,
      data
    );
  }

  if (err instanceof Error) {
    return new ApiClientError(err.message);
  }

  return new ApiClientError('Unexpected error', undefined, err);
};

export { mapArticle }; // re-used by reaction service

// ---------------------------------------------------------------------
// List feed articles  GET /articles
// ---------------------------------------------------------------------
export interface ListFeedArticlesParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

export async function listFeedArticles(
  params: ListFeedArticlesParams,
  cancelToken?: CancelToken
): Promise<ArticleListResponse> {
  try {
    const { data } = await apiClient.get('/articles', {
      params,
      cancelToken,
    });

    const rawItems: any[] = Array.isArray(data.articles) ? data.articles : [];

    return {
      success: Boolean(data.success ?? true),
      articles: rawItems.map(mapArticle),
      pagination: data.pagination ?? {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        total: rawItems.length,
        totalPages: 1,
      },
    };
  } catch (err) {
     if (axios.isCancel(err)) {
      throw err;
    }
    throw toApiClientError(err);
  }
}

// ---------------------------------------------------------------------
// List my articles  GET /articles/mine
// ---------------------------------------------------------------------
export interface ListMyArticlesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export async function listMyArticles(
  params: ListMyArticlesParams,
  cancelToken?: CancelToken
): Promise<ArticleListResponse> {
  try {
    const { data } = await apiClient.get('/articles/mine', {
      params,
      cancelToken,
    });

    const rawItems: any[] = Array.isArray(data.articles) ? data.articles : [];

    return {
      success: Boolean(data.success ?? true),
      articles: rawItems.map(mapArticle),
      pagination: data.pagination ?? {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        total: rawItems.length,
        totalPages: 1,
      },
    };
  } catch (err) {
    if (axios.isCancel(err)) {
      throw err;
    }
    throw toApiClientError(err);
  }
}

// ---------------------------------------------------------------------
// Get one article  GET /articles/:id
// ---------------------------------------------------------------------
export async function getArticleById(
  id: string,
  cancelToken?: CancelToken
): Promise<Article> {
  try {
    const { data } = await apiClient.get(`/articles/${id}`, {
      cancelToken,
    });

    const raw = data.article ?? data;
    return mapArticle(raw);
  } catch (err) {
    throw toApiClientError(err);
  }
}

// ---------------------------------------------------------------------
// Create article  POST /articles (multipart/form-data)
// ---------------------------------------------------------------------
const buildArticleFormData = (
  payload: CreateArticlePayload | UpdateArticlePayload
): FormData => {
  const form = new FormData();

  if (payload.title !== undefined) form.append('title', payload.title);
  if (payload.description !== undefined)
    form.append('description', payload.description);
  if (payload.category !== undefined) form.append('category', payload.category);

  if (payload.tags && payload.tags.length > 0) {
    // backend accepts array OR comma string; we send CSV
    form.append('tags', payload.tags.join(','));
  }

  if (payload.images && payload.images.length > 0) {
    payload.images.forEach((file) => {
      form.append('images', file); // field name from Postman
    });
  }

  if (payload.isPublished !== undefined) {
    form.append('isPublished', String(payload.isPublished));
  }

  return form;
};

export async function createArticle(
  payload: CreateArticlePayload
): Promise<Article> {
  try {
    const formData = buildArticleFormData(payload);
    const { data } = await apiClient.post('/articles', formData);

    const raw = data.article ?? data;
    return mapArticle(raw);
  } catch (err) {
    throw toApiClientError(err);
  }
}

// ---------------------------------------------------------------------
// Update article  PATCH /articles/:id
//  - if images supplied => multipart
//  - otherwise => JSON payload
// ---------------------------------------------------------------------
export async function updateArticle(
  id: string,
  payload: UpdateArticlePayload
): Promise<Article> {
  try {
    let res;

    if (payload.images && payload.images.length > 0) {
      const formData = buildArticleFormData(payload);
      res = await apiClient.patch(`/articles/${id}`, formData);
    } else {
      const body: any = {};
      if (payload.title !== undefined) body.title = payload.title;
      if (payload.description !== undefined)
        body.description = payload.description;
      if (payload.category !== undefined) body.category = payload.category;
      if (payload.tags !== undefined) body.tags = payload.tags;
      if (payload.isPublished !== undefined)
        body.isPublished = payload.isPublished;

      res = await apiClient.patch(`/articles/${id}`, body);
    }

    const raw = res.data.article ?? res.data;
    return mapArticle(raw);
  } catch (err) {
    throw toApiClientError(err);
  }
}

// ---------------------------------------------------------------------
// Delete article  DELETE /articles/:id
// ---------------------------------------------------------------------
export async function deleteArticle(id: string): Promise<void> {
  try {
    await apiClient.delete(`/articles/${id}`);
  } catch (err) {
    throw toApiClientError(err);
  }
}

// ---------------------------------------------------------------------
// Toggle publish  PATCH /articles/:id/toggle-publish
// ---------------------------------------------------------------------
export async function togglePublish(id: string): Promise<Article> {
  try {
    const { data } = await apiClient.patch(`/articles/${id}/toggle-publish`);
    const raw = data.article ?? data;
    return mapArticle(raw);
  } catch (err) {
    throw toApiClientError(err);
  }
}
