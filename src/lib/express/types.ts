export type ResponseMetadata = {
  timestamp?: string;
  requestId?: string;
};

export type SuccessResponse<T> = {
  success: true;
  data: T;
  metadata?: ResponseMetadata;
  message?: string;
};

export type ErrorResponse = {
  success: false;
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
