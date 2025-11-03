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

export type PaginationParams = {
  page?: number;
  pages?: number;
  limit?: number;
  offset?: number;
  total?: number;
};

export type BaseSortParams = {
  sortBy?: string;
  order?: "asc" | "desc";
};

export type BaseFilterParams = {
  search?: string;
};

export type GetRequestQuery = PaginationParams &
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
