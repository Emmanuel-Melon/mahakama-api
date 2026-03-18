import { describe, it, expect, vi, beforeEach } from "vitest";
import { db } from "@/lib/drizzle";
import { findLawyerById } from "../lawyers.find";
import { createMockLawyer } from "../../lawyers.factory";
import { eq } from "drizzle-orm";
import { lawyersTable } from "../../lawyers.schema";
import { findAllLawyers } from "../lawyers.find";
import { createMockLawyers } from "../../lawyers.factory";
import { paginate } from "@/lib/drizzle/drizzle.paginate";

describe("findLawyerById", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  it("should return ok:true with lawyer data when found", async () => {
    const mockLawyer = createMockLawyer({ id: "lawyer-123" });

    // Mock db.query.lawyers.findFirst to return the lawyer
    vi.mocked(db.query.lawyers.findFirst).mockResolvedValue(mockLawyer);

    const result = await findLawyerById("lawyer-123");

    expect(result).toEqual({ ok: true, data: mockLawyer });
    expect(db.query.lawyers.findFirst).toHaveBeenCalledWith({
      where: expect.anything(), // or more specific matcher
    });
  });

  it("should return ok:false with null data when lawyer not found", async () => {
    // Mock findFirst to return undefined (no lawyer found)
    vi.mocked(db.query.lawyers.findFirst).mockResolvedValue(undefined);

    const result = await findLawyerById("non-existent-id");

    expect(result).toEqual({ ok: false, data: null });
    expect(db.query.lawyers.findFirst).toHaveBeenCalledWith({
      where: eq(lawyersTable.id, "non-existent-id"),
    });
  });
});

vi.mock("@/lib/drizzle/drizzle.paginate");

describe("findAllLawyers", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return paginated lawyers", async () => {
    const mockLawyers = createMockLawyers(5);
    const mockPaginatedResult = {
      data: mockLawyers,
      metadata: { total: 5, page: 1, limit: 10, totalPages: 1 },
    };

    vi.mocked(paginate).mockResolvedValue(mockPaginatedResult as any);

    const query = {
      page: 1,
      limit: 10,
      specialization: "Criminal Law",
      order: "asc" as const,
    };
    const result = await findAllLawyers(query);

    // toManyResult transforms the paginated result to DbManyResult
    expect(result).toEqual({
      data: mockLawyers,
      count: 5,
      isEmpty: false,
      metadata: mockPaginatedResult.metadata,
    });

    expect(paginate).toHaveBeenCalledWith(
      "lawyers",
      expect.anything(), // lawyersTable
      expect.objectContaining({
        page: 1,
        limit: 10,
        order: "asc", // now included
        filters: [expect.anything()],
        search: {
          q: undefined,
          columns: [expect.anything(), expect.anything()],
        },
      }),
    );
  });

  it("should handle empty result", async () => {
    const mockPaginatedResult = {
      data: [],
      metadata: { total: 0, page: 1, limit: 10, totalPages: 0 },
    };

    vi.mocked(paginate).mockResolvedValue(mockPaginatedResult as any);
    const query = {
      page: 0,
      limit: 0,
      order: "asc",
    } as const;
    const result = await findAllLawyers(query);

    expect(result).toEqual({
      data: [],
      count: 0,
      isEmpty: true,
      metadata: mockPaginatedResult.metadata,
    });
  });
});
