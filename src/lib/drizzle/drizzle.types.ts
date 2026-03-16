export type DbSingleResult<T> =
  | { data: T; ok: true }
  | { data: null; ok: false };

export interface DbManyResult<T> {
  data: T[];
  count: number;
  isEmpty: boolean;
}

export type DbResult<T> = { ok: true; data: T } | { ok: false; data: null };
