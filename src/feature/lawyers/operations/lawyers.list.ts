import { lawyersTable } from "../lawyers.schema";
import { paginate } from "@/lib/drizzle/drizzle.paginate";
import { Lawyer, LawyerFilters } from "../lawyers.types";
import { eq } from "drizzle-orm";
import { DbManyResult } from "@/lib/drizzle/drizzle.types";
import { toManyResult } from "@/lib/drizzle/drizzle.utils";

export async function findAll(
  query: LawyerFilters,
): Promise<DbManyResult<Lawyer>> {
  const filters = [];

  if (query.specialization) {
    filters.push(eq(lawyersTable.specialization, query.specialization));
  }

  const result = await paginate<"lawyers", Lawyer>("lawyers", lawyersTable, {
    ...query,
    filters,
    search: {
      q: query.q,
      columns: [lawyersTable.name, lawyersTable.location],
    },
  });

  return toManyResult(result);
}
