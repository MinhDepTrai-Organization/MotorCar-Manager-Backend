import { getSchemaPath } from '@nestjs/swagger';
import { execArgv } from 'process';

/**
 * Creates a Swagger schema for API responses.
 * @param status HTTP status code
 * @param message Response message
 * @param data DTO class for the data property
 * @param isArray Whether the data property is an array
 * @returns Swagger schema object
 */

export const SuccessResponseBodySchema = (
  status: number,
  message: string,
  data: any,
  isArray: boolean = false,
) => {
  return {
    type: 'object',
    properties: {
      status: { type: 'number', example: status },
      message: { type: 'string', example: message },
      data: isArray
        ? {
            type: 'array',
            items: isClass(data)
              ? { $ref: getSchemaPath(data) }
              : { type: 'object', example: data },
          }
        : isClass(data)
          ? { $ref: getSchemaPath(data) }
          : { type: 'object', example: data },
    },
  };
};

const isClass = (data: any): boolean => {
  return typeof data === 'function';
};

/**
 * Creates a Swagger schema for API error responses.
 * @param status HTTP status code
 * @param message Error message
 * @param path Request path
 * @returns Swagger schema object
 */

export const ErrorResponseBodySchema = (
  status: number,
  message: string,
  path: string,
) => {
  return {
    type: 'object',
    properties: {
      status: { type: 'number', example: status },
      message: { type: 'string', example: message },
      path: { type: 'string', example: path },
    },
  };
};
