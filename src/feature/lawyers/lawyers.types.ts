import type { Lawyer } from "./lawyers.schema";
export interface FindAllOptions {
  page?: number;
  limit?: number;
  sortBy?: keyof Lawyer;
  sortOrder?: "asc" | "desc";
  search?: string;
  specialization?: string;
  minExperience?: number;
  maxExperience?: number;
  minRating?: number;
  location?: string;
  language?: string;
  [key: string]: unknown;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
