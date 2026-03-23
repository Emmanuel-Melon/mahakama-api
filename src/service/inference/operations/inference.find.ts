import { db } from "@/lib/drizzle";
import { userInferencePreferencesSchema } from "../inference.schema";
import { and, eq } from "drizzle-orm";
import { toSingleResult, toManyResult } from "@/lib/drizzle/drizzle.utils";
import type { DbSingleResult, DbManyResult } from "@/lib/drizzle/drizzle.types";
import type { UserInferencePreference } from "../inference.types";

export const findPreference = async (
  userId: string,
  strategyKey: string,
): Promise<DbSingleResult<UserInferencePreference>> => {
  const result = await db.query.userInferencePreferencesSchema.findFirst({
    where: and(
      eq(userInferencePreferencesSchema.userId, userId),
      eq(userInferencePreferencesSchema.strategyKey, strategyKey),
    ),
  });
  return toSingleResult(result as UserInferencePreference | undefined);
};

export const findPreferencesByUser = async (
  userId: string,
): Promise<DbManyResult<UserInferencePreference>> => {
  const result = await db.query.userInferencePreferencesSchema.findMany({
    where: eq(userInferencePreferencesSchema.userId, userId),
  });
  return toManyResult(result as UserInferencePreference[]);
};
