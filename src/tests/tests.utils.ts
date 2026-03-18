import { vi } from "vitest";
import { db } from "@/lib/drizzle";

export const mockDrizzleReturn = (value: any[]) => {
  // Create a reusable mock for the .returning() call
  const mockReturning = vi.fn().mockResolvedValue(value);

  // Mock Insert Chain: db.insert().values().returning()
  vi.mocked(db.insert).mockReturnValue({
    values: vi.fn().mockReturnValue({
      returning: mockReturning,
    }),
  } as any);

  // Mock Update Chain: db.update().set().where().returning()
  vi.mocked(db.update).mockReturnValue({
    set: vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue({
        returning: mockReturning,
      }),
    }),
  } as any);

  return { mockReturning };
};

export const mockDrizzleQuery = (
  table: keyof typeof db.query,
  method: "findFirst" | "findMany",
  value: any,
) => {
  return vi.mocked(db.query[table][method]).mockResolvedValue(value);
};

export const mockDrizzleEmpty = () => {
  return mockDrizzleReturn([]);
};

export const mockDrizzleError = (message = "DB error") => {
  const error = new Error(message);

  // Create a mock that rejects
  const mockReject = vi.fn().mockRejectedValue(error);

  // Re-mock the insert chain so every step returns the next step
  vi.mocked(db.insert).mockReturnValue({
    values: vi.fn().mockReturnValue({
      returning: mockReject, // The crash happens here (at the promise)
    }),
  } as any);

  return { mockReject };
};

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
