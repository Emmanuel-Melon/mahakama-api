import { pgTable, uuid, varchar, timestamp, unique } from "drizzle-orm/pg-core";
import { usersSchema } from "@/feature/users/users.schema";

export const userInferencePreferencesSchema = pgTable(
  "user_inference_preferences",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersSchema.id),
    // Matches IInferenceStrategy.key — "chat" | "qa" | "recommendations" etc.
    strategyKey: varchar("strategy_key", { length: 64 }).notNull(),
    // The user's chosen provider for this strategy
    provider: varchar("provider", { length: 32 }).notNull(),
    // Optional model override — null means use the strategy/provider default
    model: varchar("model", { length: 64 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueUserStrategy: unique("unique_user_strategy").on(
      table.userId,
      table.strategyKey,
    ),
  }),
);

export const combinedInferenceSchema = {
  userInferencePreferencesSchema,
};
