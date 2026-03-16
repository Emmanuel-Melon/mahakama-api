import { db } from "@/lib/drizzle";
import { User } from "../users.types";
import { usersSchema } from "../users.schema";
import { eq } from "drizzle-orm";
import { toSingleResult, toManyResult } from "@/lib/drizzle/drizzle.utils";
import { DbSingleResult, DbManyResult } from "@/lib/drizzle/drizzle.types";

export const findUsers = async (): Promise<DbManyResult<User>> => {
  const result = await db.query.usersSchema.findMany();
  return toManyResult(result);
};

export const findUserById = async (
  id: string,
): Promise<DbSingleResult<User>> => {
  const result = await db.query.usersSchema.findFirst({
    where: eq(usersSchema.id, id),
  });
  return toSingleResult(result);
};

export const findUserByEmail = async (
  email: string,
): Promise<DbSingleResult<User>> => {
  const [user] = await db
    .select()
    .from(usersSchema)
    .where(eq(usersSchema.email, email))
    .limit(1);
  return toSingleResult(user);
};
