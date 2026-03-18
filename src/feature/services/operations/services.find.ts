import { db } from "@/lib/drizzle";
import { eq } from "drizzle-orm";
import { servicesSchema, institutionsSchema } from "../services.schema";
import { toSingleResult, toManyResult } from "@/lib/drizzle/drizzle.utils";
import { DbSingleResult, DbManyResult } from "@/lib/drizzle/drizzle.types";
import type { LegalService, Institution } from "../services.types";

export const findServiceBySlug = async (
  slug: string,
): Promise<DbSingleResult<LegalService>> => {
  const result = await db.query.servicesSchema.findFirst({
    where: eq(servicesSchema.slug, slug),
    with: {
      institutions: {
        with: {
          institution: true,
        },
      },
    },
  });
  return toSingleResult(result);
};

export const findInstitutionById = async (
  id: string,
): Promise<DbSingleResult<Institution>> => {
  const result = await db.query.institutionsSchema.findFirst({
    where: eq(institutionsSchema.id, id),
    with: {
      services: {
        with: {
          service: true,
        },
      },
    },
  });
  return toSingleResult(result);
};

export const findAllServices = async (): Promise<
  DbManyResult<LegalService>
> => {
  const result = await db.query.servicesSchema.findMany({
    with: {
      institutions: {
        with: {
          institution: true,
        },
      },
    },
  });
  return toManyResult(result);
};

export const findAllInstitutions = async (): Promise<
  DbManyResult<Institution>
> => {
  const result = await db.query.institutionsSchema.findMany({
    with: {
      services: {
        with: {
          service: true,
        },
      },
    },
  });
  return toManyResult(result);
};
