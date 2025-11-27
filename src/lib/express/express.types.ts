import { z, ZodTypeAny } from "zod";
import { ParsedQs } from "qs";
import { ParamsDictionary } from "express-serve-static-core";
import { NextFunction, Response, Request } from "express";
import { StatusConfig } from "./http-status";

export type ResponseMetadata = {
  timestamp?: string;
  requestId?: string;
  resourceId?: string | number;
};

export type ControllerMetadata = {
  name: string;
  route: string;
  operation?: string;
  resourceType?: string;
  requestId: string;
  resourceId?: string | number;
};

export type SuccessResponse<T> = {
  success: true;
  data: T;
  metadata?: ResponseMetadata;
  message?: string;
};

export type ErrorResponse = {
  success: boolean;
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
};

export type BaseExpressResponse<T> = SuccessResponse<T> | ErrorResponse;

// Base type for all SSE events
export type SSEEvent<T = any, Type extends string = string> = {
  type: Type;
  data?: T;
  id?: string;
  retry?: number;
};

// Helper type to extract the data type from an event type
export type EventDataType<T> = T extends { type: string; data?: infer D } ? D : never;

// Helper type to create strongly typed events
export function createEvent<T extends string, D = any>(
  type: T,
  data: D,
  options?: { id?: string; retry?: number }
): SSEEvent<D, T> {
  return {
    type,
    data,
    id: options?.id,
    retry: options?.retry,
  };
}

export type SSEOptions = {
  headers?: Record<string, string>;
  metadata?: ControllerMetadata;
};

export interface PaginationOptions {
  page?: number | string;
  limit?: number | string;
  maxLimit?: number;
  defaultLimit?: number;
}

export interface PaginationResult<T = unknown> {
  data: T;
  pagination: {
    page: number;
    limit: number;
    offset: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export type PaginationQueryParams = {
  page?: number | string;
  limit?: number | string;
  total?: number;
};

export type SortDirection = 'asc' | 'desc';

export type BaseSortParams = {
  sortBy?: string;
  order?: SortDirection;
};

export type SortConfig<T extends readonly string[]> = {
  field: T[number];
  direction: SortDirection;
};

export type SortConfigOptions<T extends readonly string[]> = {
  /** The field to sort by */
  sortBy?: string;
  /** The sort direction */
  order?: SortDirection;
  /** Array of valid sortable fields */
  validFields: T;
  /** Default field to sort by if none provided */
  defaultField: T[number];
  /** Default sort direction if none provided */
  defaultDirection?: SortDirection;
};

export type SortableFields<T extends readonly string[]> = T[number];

export type BaseFilterParams = {
  search?: string;
};

export type GetRequestQuery = PaginationQueryParams &
  BaseSortParams &
  BaseFilterParams;

export type TypedRequestQuery<T extends ZodTypeAny> = Omit<Request, "query"> & {
  query: z.infer<T> & ParsedQs;
};

export type TypedRequestParams<T extends ZodTypeAny> = Omit<
  Request,
  "params"
> & {
  params: z.infer<T> & ParamsDictionary;
};

export type GetByIdRequest = {
  id: string;
};

// POST Request types
export type CreateRequest<T> = {
  body: T;
};

// PATCH/PUT Request types
export type UpdateRequest<T> = {
  id: string;
  body: Partial<T>; // Partial for PATCH, T for PUT
};

// DELETE Request types
export type DeleteRequest = {
  id: string;
};


// server types
export type ServerStatus = "healthy" | "maintenance" | "unhealthy";

export interface HealthCheckResponse {
  status: ServerStatus;
  message: string;
  environment: string;
  timestamp: string;
  services: {
    database: string;
    [key: string]: string | undefined;
  };
  error?: string;
}

export interface WelcomeResponse {
  message: string;
  documentation: string;
  environment: string;
  timestamp: string;
  endpoints: {
    health: string;
    apiDocs: string;
    auth?: string;
    apiBase: string;
  };
  status: ServerStatus;
  version?: string;
}

export interface ResourceResponseOptions {
  requestId?: string;
  successStatus?: StatusConfig;
}

export interface JsonApiResourceConfig<T> {
  type: string;
  attributes: (resource: T) => Record<string, any>;
  resourceMeta?: (resource: T) => Record<string, any>;
}

export type JsonApiResponseConfig<T> = {
  type: "single" | "collection";
  data: (T & { id: string }) | (T & { id: string })[];
  serializerConfig: JsonApiResourceConfig<T>;
};

export interface JsonApiResponse<T> {
  data: T;
  meta: {
    requestId: string;
    timestamp: string;
    [key: string]: any;
  };
}

export interface JsonApiError {
  id: string;
  status: string;
  code: string;
  title: string;
  detail: string;
  meta: {
    requestId: string;
    timestamp: string;
    [key: string]: any;
  };
  source?: {
    pointer?: string;
    method?: string;
  };
}

export interface JsonApiErrorResponse {
  errors: JsonApiError[];
}