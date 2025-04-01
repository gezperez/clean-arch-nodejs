import { ValidationError } from 'class-validator';

export interface ValidationErrorResponse {
  message: string;
  errors: {
    field: string;
    message: string;
  }[];
}

export function formatValidationErrors(
  errors: ValidationError[],
): ValidationErrorResponse {
  const formattedErrors = errors.map((error) => ({
    field: error.property,
    message: Object.values(error.constraints || {}).join(', '),
  }));

  return {
    message: 'Validation failed',
    errors: formattedErrors,
  };
}

export function isValidYear(year: string): boolean {
  const yearNum = parseInt(year);
  return !isNaN(yearNum) && yearNum.toString().length === 4;
}
