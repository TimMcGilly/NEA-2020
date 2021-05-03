/**
 * Express request and validation utils.
 * Provides functions to format responses in Jsend format https://github.com/omniti-labs/jsend
*/
// Functions based off previous collaborative web project

import { RequestHandler } from 'express';
import { Result, ValidationError, validationResult } from 'express-validator';

type APIResponseSuccess = {
  status: 'success',
  data: unknown
};

type APIResponseFail = {
  status: 'fail',
  data: string[]
};

type APIResponseError = {
  status: 'error',
  message: string,
  data?: unknown,
  code?: number
};

export type APIResponse = APIResponseSuccess | APIResponseFail | APIResponseError;

/**
 * Formats successful request to Jsend spec
 * @param data Data to return in request
 * @returns Formatted request
 */
export function SuccessFmt(data: unknown): APIResponse {
  return {
    status: 'success',
    data,
  };
}

/**
 * Formats fail request to Jsend spec. Used for validation fails or bad input
 * @param errors Array of error messages to return in request
 * @returns Formatted request
 */
export function FailFmt(errors: string[]): APIResponse {
  return {
    status: 'fail',
    data: errors,

  };
}

/**
 * Formats error request to Jsend spec
 * @param message Error message to return in request
 * @returns Formatted request
 */
export function ErrorFmt(message: string, data?: unknown, code?: number): APIResponse {
  return {
    status: 'error',
    message,
    data,
    code,
  };
}

/**
 * Format validation errors as string array for fail
 * @param errors Validation errors from validator.js
 * @returns Formatted error message string array
 */
function FormatValidatorErrors(errors: Result<ValidationError>): string[] {
  const formattedErrors: string[] = [];
  errors.array().forEach((e) => {
    formattedErrors.push(`${e.param}: ${e.msg}`);
  });

  return formattedErrors;
}

/**
 * Express middleware to check validation from express-validator and send reponse if fail.
 */
export const CheckValidation: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json(FailFmt(FormatValidatorErrors(errors)));
  }
  next();
};
