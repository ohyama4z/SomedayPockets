import type { Lane } from "./types";

/** レーンの日本語表示名 */
export function laneLabel(lane: Lane): string {
  switch (lane) {
    case "inbox":
      return "インボックス";
    case "stock":
      return "ストック";
    case "next":
      return "ネクスト";
  }
}

/**
 * 三層構造における「次のレーン」を返す。
 *
 * インボックス → ストック → ネクスト の順に引き上げる。
 * ネクストはこれ以上引き上げ先がないため null を返す。
 */
export function getNextLane(current: Lane): Lane | null {
  switch (current) {
    case "inbox":
      return "stock";
    case "stock":
      return "next";
    default:
      return null;
  }
}
