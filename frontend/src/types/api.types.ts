export interface ApiValidationIssue {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: ApiValidationIssue[];
}

export interface BaseApiSuccessResponse<T = any> {
  success: true;
  message?: string;
  data?: T;
  [key: string]: any; // e.g. user, categories, accessToken
}
