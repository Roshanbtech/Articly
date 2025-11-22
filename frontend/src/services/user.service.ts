// src/services/user.service.ts
import axios from "axios";
import apiClient from "../config/apiClient";

import { ApiClientError } from "../lib/apiClientError";
import type { ApiErrorResponse } from "../types/api.types";
import type {
  ArticlyUser,
  UpdateProfilePayload,
  UpdatePreferencesPayload,
  ChangePasswordPayload,
} from "../types/user.types";

interface GetMeResponse {
  success: boolean;
  user: ArticlyUser;
}

interface UpdateMeResponse {
  success: boolean;
  message: string;
  user: ArticlyUser;
}

interface UpdatePreferencesResponse {
  success: boolean;
  message: string;
  user: ArticlyUser;
}

interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

/**
 * Normalise any error into an ApiClientError.
 * Callers should `throw toApiClientError(err)` inside catch blocks.
 */
const toApiClientError = (err: unknown): ApiClientError => {
  if (err instanceof ApiClientError) {
    return err;
  }

  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const data = err.response?.data as ApiErrorResponse | undefined;

    return new ApiClientError(
      data?.message || err.message || "Request failed",
      status,
      data
    );
  }

  if (err instanceof Error) {
    return new ApiClientError(err.message);
  }

  return new ApiClientError("Unexpected error", undefined, err);
};

export async function getCurrentUser(): Promise<ArticlyUser> {
  try {
    const { data } = await apiClient.get<GetMeResponse>("/users/me");
    return data.user;
  } catch (err) {
    throw toApiClientError(err);
  }
}

export async function updateProfile(
  payload: UpdateProfilePayload
): Promise<ArticlyUser> {
  const formData = new FormData();

  if (payload.firstName !== undefined) {
    formData.append("firstName", payload.firstName);
  }
  if (payload.lastName !== undefined) {
    formData.append("lastName", payload.lastName);
  }
  if (payload.profileImageFile) {
    formData.append("profileImage", payload.profileImageFile);
  }

  try {
    const { data } = await apiClient.patch<UpdateMeResponse>(
      "/users/me",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return data.user;
  } catch (err) {
    throw toApiClientError(err);
  }
}

export async function updateUserPreferences(
  payload: UpdatePreferencesPayload
): Promise<ArticlyUser> {
  try {
    const { data } = await apiClient.patch<UpdatePreferencesResponse>(
      "/users/me/preferences",
      payload
    );

    return data.user;
  } catch (err) {
    throw toApiClientError(err);
  }
}

export async function changePassword(
  payload: ChangePasswordPayload
): Promise<void> {
  try {
    await apiClient.patch<ChangePasswordResponse>(
      "/users/me/password",
      payload
    );
  } catch (err) {
    throw toApiClientError(err);
  }
}
