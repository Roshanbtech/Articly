import type { ApiValidationIssue } from '../types/api.types';

export type FieldErrorMap = Record<string, string>;

export const mapValidationErrors = (
  issues?: ApiValidationIssue[]
): FieldErrorMap => {
  const result: FieldErrorMap = {};
  if (!issues) return result;

  for (const issue of issues) {
    if (issue.field) {
      result[issue.field] = issue.message;
    }
  }

  return result;
};
