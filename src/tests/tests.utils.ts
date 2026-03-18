import { vi } from "vitest";
import { db } from "@/lib/drizzle";

/**
 * Universal Fluent API Mock (insert/update) operations
 */
export const mockDrizzleChain = (finalValue: any, isError = false) => {
  const finalStep = isError
    ? vi.fn().mockRejectedValue(new Error(finalValue))
    : vi.fn().mockResolvedValue(finalValue);

  const chain = {
    values: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    returning: finalStep,
  };

  vi.mocked(db.insert).mockReturnValue(chain as any);
  vi.mocked(db.update).mockReturnValue(chain as any);

  return { finalStep };
};

/**
 * Relational API Mock
 */
export const mockDrizzleQuery = (
  table: keyof typeof db.query,
  method: "findFirst" | "findMany",
  value: any,
) => {
  return vi.mocked(db.query[table][method]).mockResolvedValue(value);
};

export const mockDrizzleEmpty = () => mockDrizzleChain([]);
