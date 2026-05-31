import { getDb } from "@/db";
import { items, laneValues, type Lane } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const body = await request.json();
  const db = getDb();

  const existing = await db.select().from(items).where(eq(items.id, id));
  if (existing.length === 0) {
    return Response.json({ error: "アイテムが見つかりません" }, { status: 404 });
  }

  const now = new Date().toISOString();
  const updates: Record<string, unknown> = { updatedAt: now };

  // レーン移動
  if ("lane" in body) {
    const newLane = body.lane as Lane;
    if (!laneValues.includes(newLane)) {
      return Response.json({ error: "無効なlaneです" }, { status: 400 });
    }
    updates.lane = newLane;

    // nextに移動する場合、末尾に追加
    if (newLane === "next") {
      const nextItems = await db
        .select({ sortOrder: items.sortOrder })
        .from(items)
        .where(eq(items.lane, "next"));
      updates.sortOrder =
        nextItems.length > 0
          ? Math.max(...nextItems.map((e) => e.sortOrder)) + 1
          : 0;
    } else {
      updates.sortOrder = 0;
    }
  }

  // 並べ替え
  if ("sortOrder" in body) {
    updates.sortOrder = body.sortOrder as number;
  }

  // 完了
  if ("completed" in body) {
    updates.completed = body.completed as boolean;
    updates.completedAt = body.completed ? now : null;
  }

  await db.update(items).set(updates).where(eq(items.id, id));

  const updated = await db.select().from(items).where(eq(items.id, id));
  return Response.json(updated[0]);
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const db = getDb();

  const existing = await db.select().from(items).where(eq(items.id, id));
  if (existing.length === 0) {
    return Response.json({ error: "アイテムが見つかりません" }, { status: 404 });
  }

  await db.delete(items).where(eq(items.id, id));
  return new Response(null, { status: 204 });
}
