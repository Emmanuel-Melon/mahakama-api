import { db } from "@/lib/drizzle";
import { and, eq } from "drizzle-orm";
import { userInferencePreferencesSchema } from "../inference.schema";

export const disabletInferencePreference = async (
  userId: string,
  strategyKey: string,
): Promise<void> => {
  await db
    .delete(userInferencePreferencesSchema)
    .where(
      and(
        eq(userInferencePreferencesSchema.userId, userId),
        eq(userInferencePreferencesSchema.strategyKey, strategyKey),
      ),
    );
};
