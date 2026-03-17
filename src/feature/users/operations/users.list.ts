import { usersSchema } from "../users.schema";
import type { User } from "../users.types";
import { UserFilters } from "../users.types";
import { paginate } from "@/lib/drizzle/drizzle.paginate";
import { eq } from "drizzle-orm";
import { DbManyResult } from "@/lib/drizzle/drizzle.types";
import { toManyResult } from "@/lib/drizzle/drizzle.utils";

export async function findAll(
  query: UserFilters,
): Promise<DbManyResult<User>> {
  const filters = [];

  if (query.role) {
    filters.push(eq(usersSchema.role, query.role));
  }

  const result = await paginate<"usersSchema", User>("usersSchema", usersSchema, {
    ...query,
    filters,
    search: {
      q: query.q,
      columns: [usersSchema.name, usersSchema.email],
    },
  });

  return toManyResult(result);
}