import { getDb } from "@/db";
import { items, laneValues, type Lane } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const lane = request.nextUrl.searchParams.get("lane") as Lane | null;
  const db = getDb();

  if (lane && !laneValues.includes(lane)) {
    return Response.json({ error: "無効なlaneです" }, { status: 400 });
  }

  const result = lane
    ? await db.select().from(items).where(eq(items.lane, lane))
    : await db.select().from(items);

  // nextレーンはsortOrder順、それ以外はcreatedAt降順
  const sorted = result.sort((a, b) => {
    if (a.lane === "next" && b.lane === "next") {
      return a.sortOrder - b.sortOrder;
    }
    return b.createdAt.localeCompare(a.createdAt);
  });

  return Response.json(sorted);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, immediate } = body as { title: string; immediate?: boolean };

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return Response.json({ error: "タイトルは必須です" }, { status: 400 });
  }

  const db = getDb();
  const now = new Date().toISOString();
  const lane: Lane = immediate ? "next" : "inbox";

  // nextに直行する場合、最大sortOrderの次を設定
  let sortOrder = 0;
  if (immediate) {
    const existing = await db
      .select({ sortOrder: items.sortOrder })
      .from(items)
      .where(eq(items.lane, "next"));
    sortOrder =
      existing.length > 0
        ? Math.max(...existing.map((e) => e.sortOrder)) + 1
        : 0;
  }

  const id = crypto.randomUUID();
  const newItem = {
    id,
    title: title.trim(),
    lane,
    sortOrder,
    completed: false,
    createdAt: now,
    updatedAt: now,
  };

  await db.insert(items).values(newItem);
  return Response.json(newItem, { status: 201 });
}
