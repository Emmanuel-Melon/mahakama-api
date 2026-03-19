import { beforeEach, vi } from "vitest";
import { truncateTables } from "./tests.utils";

beforeEach(async () => {
  vi.clearAllMocks();
  await truncateTables(["usersSchema"]);
});
