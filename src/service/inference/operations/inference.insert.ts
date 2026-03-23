import { db } from "@/lib/drizzle";
import { userInferencePreferencesSchema } from "../inference.schema";
import { and, eq } from "drizzle-orm";
import { toSingleResult, toManyResult } from "@/lib/drizzle/drizzle.utils";
import type { DbSingleResult, DbManyResult } from "@/lib/drizzle/drizzle.types";
import type { UserInferencePreference } from "../inference.types";
import type { LLMProviderName } from "@/lib/llm/llms.types";
import { v4 as uuid } from "uuid";

export const upsertPreference = async (
  userId: string,
  strategyKey: string,
  provider: LLMProviderName,
  model?: string,
): Promise<DbSingleResult<UserInferencePreference>> => {
  const [result] = await db
    .insert(userInferencePreferencesSchema)
    .values({
      id: uuid(),
      userId,
      strategyKey,
      provider,
      model: model ?? null,
    })
    .onConflictDoUpdate({
      target: [
        userInferencePreferencesSchema.userId,
        userInferencePreferencesSchema.strategyKey,
      ],
      set: {
        provider,
        model: model ?? null,
        updatedAt: new Date(),
      },
    })
    .returning();

  return toSingleResult(result as UserInferencePreference | undefined);
};
