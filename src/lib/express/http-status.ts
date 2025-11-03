export type StatusConfig = {
  statusCode: number;
  defaultMessage: string;
  code: string;
};

type StatusCatalog = {
  // 2xx Success
  SUCCESS: StatusConfig;
  CREATED: StatusConfig;
  ACCEPTED: StatusConfig;
  NO_CONTENT: StatusConfig;

  // 3xx Redirection
  MOVED_PERMANENTLY: StatusConfig;
  FOUND: StatusConfig;
  NOT_MODIFIED: StatusConfig;
  TEMPORARY_REDIRECT: StatusConfig;
  PERMANENT_REDIRECT: StatusConfig;

  // 4xx Client Errors
  BAD_REQUEST: StatusConfig;
  UNAUTHORIZED: StatusConfig;
  PAYMENT_REQUIRED: StatusConfig;
  FORBIDDEN: StatusConfig;
  NOT_FOUND: StatusConfig;
  METHOD_NOT_ALLOWED: StatusConfig;
  NOT_ACCEPTABLE: StatusConfig;
  REQUEST_TIMEOUT: StatusConfig;
  CONFLICT: StatusConfig;
  GONE: StatusConfig;
  TOO_MANY_REQUESTS: StatusConfig;

  // 5xx Server Errors
  INTERNAL_SERVER_ERROR: StatusConfig;
  NOT_IMPLEMENTED: StatusConfig;
  BAD_GATEWAY: StatusConfig;
  SERVICE_UNAVAILABLE: StatusConfig;
  GATEWAY_TIMEOUT: StatusConfig;
};

export const HttpStatus: StatusCatalog = {
  // 2xx Success
  SUCCESS: {
    statusCode: 200,
    defaultMessage: "Request successful",
    code: "SUCCESS",
  },
  CREATED: {
    statusCode: 201,
    defaultMessage: "Resource created successfully",
    code: "CREATED",
  },
  ACCEPTED: {
    statusCode: 202,
    defaultMessage: "Request accepted for processing",
    code: "ACCEPTED",
  },
  NO_CONTENT: {
    statusCode: 204,
    defaultMessage: "No content to return",
    code: "NO_CONTENT",
  },

  // 3xx Redirection
  MOVED_PERMANENTLY: {
    statusCode: 301,
    defaultMessage: "The requested resource has been moved permanently",
    code: "MOVED_PERMANENTLY",
  },
  FOUND: {
    statusCode: 302,
    defaultMessage: "The requested resource has been found",
    code: "FOUND",
  },
  NOT_MODIFIED: {
    statusCode: 304,
    defaultMessage: "Resource not modified",
    code: "NOT_MODIFIED",
  },
  TEMPORARY_REDIRECT: {
    statusCode: 307,
    defaultMessage: "Temporary redirect",
    code: "TEMPORARY_REDIRECT",
  },
  PERMANENT_REDIRECT: {
    statusCode: 308,
    defaultMessage: "Permanent redirect",
    code: "PERMANENT_REDIRECT",
  },

  // 4xx Client Errors
  BAD_REQUEST: {
    statusCode: 400,
    defaultMessage: "Bad request",
    code: "BAD_REQUEST",
  },
  UNAUTHORIZED: {
    statusCode: 401,
    defaultMessage: "Unauthorized",
    code: "UNAUTHORIZED",
  },
  PAYMENT_REQUIRED: {
    statusCode: 402,
    defaultMessage: "Payment required",
    code: "PAYMENT_REQUIRED",
  },
  FORBIDDEN: {
    statusCode: 403,
    defaultMessage: "Forbidden",
    code: "FORBIDDEN",
  },
  NOT_FOUND: {
    statusCode: 404,
    defaultMessage: "Resource not found",
    code: "NOT_FOUND",
  },
  METHOD_NOT_ALLOWED: {
    statusCode: 405,
    defaultMessage: "Method not allowed",
    code: "METHOD_NOT_ALLOWED",
  },
  NOT_ACCEPTABLE: {
    statusCode: 406,
    defaultMessage: "Not acceptable",
    code: "NOT_ACCEPTABLE",
  },
  REQUEST_TIMEOUT: {
    statusCode: 408,
    defaultMessage: "Request timeout",
    code: "REQUEST_TIMEOUT",
  },
  CONFLICT: {
    statusCode: 409,
    defaultMessage: "Conflict occurred",
    code: "CONFLICT",
  },
  GONE: {
    statusCode: 410,
    defaultMessage: "Resource is no longer available",
    code: "GONE",
  },
  TOO_MANY_REQUESTS: {
    statusCode: 429,
    defaultMessage: "Too many requests",
    code: "TOO_MANY_REQUESTS",
  },

  // 5xx Server Errors
  INTERNAL_SERVER_ERROR: {
    statusCode: 500,
    defaultMessage: "Internal server error",
    code: "INTERNAL_SERVER_ERROR",
  },
  NOT_IMPLEMENTED: {
    statusCode: 501,
    defaultMessage: "Not implemented",
    code: "NOT_IMPLEMENTED",
  },
  BAD_GATEWAY: {
    statusCode: 502,
    defaultMessage: "Bad gateway",
    code: "BAD_GATEWAY",
  },
  SERVICE_UNAVAILABLE: {
    statusCode: 503,
    defaultMessage: "Service unavailable",
    code: "SERVICE_UNAVAILABLE",
  },
  GATEWAY_TIMEOUT: {
    statusCode: 504,
    defaultMessage: "Gateway timeout",
    code: "GATEWAY_TIMEOUT",
  },
} as const;

export type StatusKey = keyof typeof HttpStatus;

export type StatusResponse = {
  statusCode: number;
  message: string;
  code: string;
};
