import { describe, it, expect, vi, beforeEach } from "vitest";
import { db } from "@/lib/drizzle";
import { updateLawyer } from "../lawyers.update";
import { createMockLawyer, createMockNewLawyer } from "../../lawyers.factory";

describe("updateLawyer", () => {
  const lawyerId = 123;
  const updateData = createMockNewLawyer({
    name: "Updated Name",
    specialization: "Family Law",
  });

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should update a lawyer and return ok:true with updated lawyer", async () => {
    const mockUpdatedLawyer = createMockLawyer({
      id: lawyerId.toString(),
      ...updateData,
    });

    // Mock the update chain
    const mockReturning = vi.fn().mockResolvedValue([mockUpdatedLawyer]);
    const mockWhere = vi.fn().mockReturnValue({ returning: mockReturning });
    const mockSet = vi.fn().mockReturnValue({ where: mockWhere });
    const mockUpdate = vi.fn().mockReturnValue({ set: mockSet });
    vi.mocked(db.update).mockImplementation(mockUpdate as any);

    const result = await updateLawyer(lawyerId, updateData);

    expect(result).toEqual({ ok: true, data: mockUpdatedLawyer });
    expect(db.update).toHaveBeenCalledWith(expect.anything());
    expect(mockSet).toHaveBeenCalledWith(
      expect.objectContaining({
        ...updateData,
        updatedAt: expect.any(Date),
      }),
    );
    expect(mockWhere).toHaveBeenCalledWith(expect.anything()); // could also check eq condition
    expect(mockReturning).toHaveBeenCalled();
  });

  it("should return ok:false with null if no lawyer was updated (id not found)", async () => {
    const mockReturning = vi.fn().mockResolvedValue([]);
    const mockWhere = vi.fn().mockReturnValue({ returning: mockReturning });
    const mockSet = vi.fn().mockReturnValue({ where: mockWhere });
    vi.mocked(db.update).mockReturnValue({ set: mockSet } as any);

    const result = await updateLawyer(lawyerId, updateData);

    expect(result).toEqual({ ok: false, data: null });
  });
});
