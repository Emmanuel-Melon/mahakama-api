import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const ResponseMetadataSchema = z.object({
  timestamp: z.string().datetime().optional().openapi({
    description: 'ISO 8601 timestamp of the response',
    example: '2023-12-09T15:39:00Z'
  }),
  requestId: z.string().uuid().optional().openapi({
    description: 'Unique identifier for the request',
    example: 'req_12345'
  }),
  resourceId: z.union([z.string(), z.number()]).optional().openapi({
    description: 'Identifier of the resource',
    example: 'resource_678'
  }),
}).passthrough().openapi({
  description: 'Metadata about the response'
});

export const ValidationErrorSchema = z.object({
  field: z.string().openapi({
    description: 'The field that failed validation',
    example: 'email'
  }),
  message: z.string().openapi({
    description: 'Description of the validation error',
    example: 'Invalid email format'
  }),
  code: z.string().openapi({
    description: 'Error code from validator',
    example: 'invalid_string'
  }),
}).openapi({
  description: 'Validation error detail'
});

export const JsonApiErrorSchema = z.object({
  id: z.string().uuid().openapi({
    description: 'Unique identifier for this error instance',
    example: 'error_123'
  }),
  status: z.string().openapi({
    description: 'HTTP status code as string',
    example: '400'
  }),
  code: z.string().openapi({
    description: 'Application-specific error code',
    example: 'BAD_REQUEST'
  }),
  title: z.string().openapi({
    description: 'Short, human-readable summary of the error',
    example: 'Bad Request'
  }),
  detail: z.string().openapi({
    description: 'Human-readable explanation specific to this error',
    example: 'The request could not be understood'
  }),
  metadata: ResponseMetadataSchema,
  source: z.object({
    pointer: z.string().optional().openapi({
      description: 'JSON Pointer to the associated entity in request',
      example: '/data/attributes/email'
    }),
    method: z.string().optional().openapi({
      description: 'HTTP method of the request',
      example: 'POST'
    }),
  }).optional(),
  meta: z.object(z.any()).optional().openapi({
    description: 'Additional error metadata (e.g., validation errors)',
    example: {
      validationErrors: [
        { field: 'email', message: 'Invalid email format', code: 'invalid_string' }
      ]
    }
  }),
}).openapi({
  description: 'JSON:API error format',
  example: {
    id: 'error_123',
    status: '400',
    code: 'BAD_REQUEST',
    title: 'Bad Request',
    detail: 'Request validation failed',
    metadata: {
      timestamp: '2023-12-09T15:39:00Z',
      requestId: 'req_12345'
    },
    meta: {
      validationErrors: [
        { field: 'email', message: 'Invalid email format', code: 'invalid_string' }
      ]
    }
  }
});

export const JsonApiErrorResponseSchema = z.object({
  errors: z.array(JsonApiErrorSchema).openapi({
    description: 'Array of error objects'
  })
}).openapi({
  description: 'JSON:API error response format'
});

export const ResponseLinksSchema = z.object({
  self: z.string().url().optional().openapi({
    description: 'Link to the current resource',
    example: 'https://api.example.com/api/v1/users/123'
  }),
  first: z.string().url().optional().openapi({
    description: 'Link to the first page',
    example: 'https://api.example.com/api/v1/users?page=1'
  }),
  last: z.string().url().optional().openapi({
    description: 'Link to the last page',
    example: 'https://api.example.com/api/v1/users?page=10'
  }),
  prev: z.string().url().optional().openapi({
    description: 'Link to the previous page',
    example: 'https://api.example.com/api/v1/users?page=2'
  }),
  next: z.string().url().optional().openapi({
    description: 'Link to the next page',
    example: 'https://api.example.com/api/v1/users?page=4'
  }),
}).openapi({
  description: 'Links related to the response'
});

export type ResponseMetadata = z.infer<typeof ResponseMetadataSchema>;
export type ResponseLinks = z.infer<typeof ResponseLinksSchema>;
export type JsonApiError = z.infer<typeof JsonApiErrorSchema>;