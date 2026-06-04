import { describe, it, expect } from "vitest";
import { getNextLane, laneLabel } from "@/lib/lane";

describe("getNextLane（三層構造の引き上げ順）", () => {
  it("インボックスの次はストック", () => {
    expect(getNextLane("inbox")).toBe("stock");
  });

  it("ストックの次はネクスト", () => {
    expect(getNextLane("stock")).toBe("next");
  });

  it("ネクストは引き上げ先がないためnull", () => {
    expect(getNextLane("next")).toBeNull();
  });
});

describe("laneLabel（レーンの日本語表示名）", () => {
  it("各レーンの表示名を返す", () => {
    expect(laneLabel("inbox")).toBe("インボックス");
    expect(laneLabel("stock")).toBe("ストック");
    expect(laneLabel("next")).toBe("ネクスト");
  });
});
