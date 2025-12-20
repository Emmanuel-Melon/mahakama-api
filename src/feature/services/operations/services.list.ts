import { db } from "@/lib/drizzle";
import { legalServicesTable, LegalService } from "../services.schema";
import { eq, ilike } from "drizzle-orm";

export const getLegalServices = async (
  category?: string,
): Promise<LegalService[]> => {
  if (category && category !== "all") {
    const services = await db
      .select()
      .from(legalServicesTable)
      .where(eq(legalServicesTable.category, category as any));
    return services;
  } else {
    const services = await db.select().from(legalServicesTable);
    return services;
  }
};

export const getLegalServiceById = async (
  id: string,
): Promise<LegalService | null> => {
  const service = await db
    .select()
    .from(legalServicesTable)
    .where(eq(legalServicesTable.id, id))
    .limit(1);
  return service[0] || null;
};

export const searchLegalServices = async (
  query: string,
): Promise<LegalService[]> => {
  const services = await db
    .select()
    .from(legalServicesTable)
    .where(ilike(legalServicesTable.name, `%${query}%`));
  return services;
};
