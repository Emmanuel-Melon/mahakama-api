import { z, ZodTypeAny } from "zod";
import { ParsedQs } from "qs";
import { ParamsDictionary } from "express-serve-static-core";
import { NextFunction, Response, Request } from "express";

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
