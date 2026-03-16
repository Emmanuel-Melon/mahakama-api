import { DbSingleResult, DbManyResult, DbResult } from "./drizzle.types";

export const toSingleResult = <T>(
  data: T | undefined | null,
): DbSingleResult<T> =>
  data == null ? { data: null, ok: false } : { data, ok: true };

export const toResult = <T>(data: T | null | undefined): DbResult<T> =>
  data == null ? { ok: false, data: null } : { ok: true, data };

export const toManyResult = <T>(data: T[]): DbManyResult<T> => ({
  data,
  count: data.length,
  isEmpty: data.length === 0,
});

export function unwrap<T>(result: DbResult<T>, error?: Error): T {
  if (!result.ok) {
    throw error ?? new Error("Database result was not OK");
  }

  return result.data;
}
