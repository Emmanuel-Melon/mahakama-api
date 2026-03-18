import { describe, it, expect, vi, beforeEach } from "vitest";
import { db } from "@/lib/drizzle";
import { createLawyer } from "../lawyers.create";
import { createMockLawyer } from "../../lawyers.factory";

describe("createLawyer", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should create a lawyer and return ok:true with the created lawyer", async () => {
    const mockCreatedLawyer = createMockLawyer();

    // Mock the insert chain to return the created lawyer
    const mockReturning = vi.fn().mockResolvedValue([mockCreatedLawyer]);
    const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
    const mockInsert = vi.fn().mockReturnValue({ values: mockValues });
    vi.mocked(db.insert).mockImplementation(mockInsert as any);

    const result = await createLawyer(mockCreatedLawyer);

    expect(result).toEqual({ ok: true, data: mockCreatedLawyer });
    expect(db.insert).toHaveBeenCalledWith(expect.anything());
    expect(mockReturning).toHaveBeenCalled();
  });
});
