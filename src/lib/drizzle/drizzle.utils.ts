import {
  DbSingleResult,
  DbManyResult,
  DbResult,
  PaginatedResult,
} from "./drizzle.types";

export const toSingleResult = <T>(
  data: T | undefined | null,
): DbSingleResult<T> =>
  data == null ? { data: null, ok: false } : { data, ok: true };

export const toResult = <T>(data: T | null | undefined): DbResult<T> =>
  data == null ? { ok: false, data: null } : { ok: true, data };

export function toManyResult<T>(
  result: T[] | PaginatedResult<T>,
): DbManyResult<T> {
  if ("metadata" in result) {
    return {
      data: result.data,
      count: result.metadata.total,
      isEmpty: result.data.length === 0,
      metadata: result.metadata,
    };
  }

  return {
    data: result,
    count: result.length,
    isEmpty: result.length === 0,
  };
}

export function unwrap<T>(result: DbResult<T>, error?: Error): T {
  if (!result.ok) {
    throw error ?? new Error("Database result was not OK");
  }

  return result.data;
}
