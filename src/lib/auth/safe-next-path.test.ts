import { describe, expect, it } from "vitest";
import { safeNextPath } from "./safe-next-path";

describe("safeNextPath", () => {
  it.each([null, "", "https://attacker.example", "//attacker.example", "/\\attacker.example", "/%5cattacker.example", "/%2fattacker.example", "/.//attacker.example", "/%2e//attacker.example", "/a/..//attacker.example", "/\t/attacker.example", "/%0a/attacker.example"])(
    "rejects unsafe destination %s", (value) => expect(safeNextPath(value)).toBe("/app"),
  );
  it("keeps a local path, query and fragment", () => {
    expect(safeNextPath("/app/projects?archived=1#list")).toBe("/app/projects?archived=1#list");
  });
});
