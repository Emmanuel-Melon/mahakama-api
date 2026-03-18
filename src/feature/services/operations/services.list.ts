import { db } from "@/lib/drizzle";
import { legalServicesTable, LegalService } from "../services.schema";
import { eq, ilike } from "drizzle-orm";
import { toSingleResult, toManyResult } from "@/lib/drizzle/drizzle.utils";
import { DbSingleResult, DbManyResult } from "@/lib/drizzle/drizzle.types";

export const getLegalServices = async (
  category?: string,
): Promise<DbManyResult<LegalService>> => {
  if (category && category !== "all") {
    const services = await db
      .select()
      .from(legalServicesTable)
      .where(eq(legalServicesTable.category, category as any));
    return toManyResult(services);
  } else {
    const services = await db.select().from(legalServicesTable);
    return toManyResult(services);
  }
};

export const getLegalServiceById = async (
  id: string,
): Promise<DbSingleResult<LegalService>> => {
  const service = await db
    .select()
    .from(legalServicesTable)
    .where(eq(legalServicesTable.id, id))
    .limit(1);
  return toSingleResult(service[0] || null);
};

export const searchLegalServices = async (
  query: string,
): Promise<DbManyResult<LegalService>> => {
  const services = await db
    .select()
    .from(legalServicesTable)
    .where(ilike(legalServicesTable.name, `%${query}%`));
  return toManyResult(services);
};
