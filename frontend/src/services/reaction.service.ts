// src/services/reaction.service.ts
import apiClient from '../config/apiClient';
import { ApiClientError } from '../lib/apiClientError';
import type { ApiErrorResponse } from '../types/api.types';
import type { Article } from '../types/article.types';
import axios from 'axios';
import { mapArticle } from './article.service';

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

const react = async (
  articleId: string,
  type: 'like' | 'dislike' | 'block'
): Promise<Article> => {
  try {
    const { data } = await apiClient.post(
      `/reactions/${articleId}/${type}`,
      {}
    );
    const raw = data.article ?? data;
    return mapArticle(raw);
  } catch (err) {
    throw toApiClientError(err);
  }
};

export const likeArticle = (articleId: string) => react(articleId, 'like');
export const dislikeArticle = (articleId: string) =>
  react(articleId, 'dislike');
export const blockArticle = (articleId: string) => react(articleId, 'block');
