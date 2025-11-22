import type { ApiErrorResponse } from '../types/api.types';

export class ApiClientError extends Error {
  status?: number;
  data?: ApiErrorResponse | any;

  constructor(message: string, status?: number, data?: any) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = 'ApiClientError';

    this.status = status;
    this.data = data;
  }
}
