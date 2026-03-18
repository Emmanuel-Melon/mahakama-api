import { vi } from "vitest";

vi.mock("@/config", () => import("@/config/test.config"));

const mockRelationalQuery = {
  findMany: vi.fn(),
  findFirst: vi.fn(),
};

// Mock drizzle with both raw and relational APIs
vi.mock("@/lib/drizzle", () => ({
  db: {
    // Raw API for insert/update/delete
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([]), // default empty
      }),
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([]),
        }),
      }),
    }),
    select: vi.fn().mockReturnThis(), // for count queries if needed
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    // Relational API
    query: {
      lawyers: mockRelationalQuery,
      usersSchema: mockRelationalQuery,
    },
  },
}));
