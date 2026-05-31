import { getDb } from "@/db";
import { items } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

// ネクストレーン内の並べ替え（ID配列で順序を指定）
export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { orderedIds } = body as { orderedIds: string[] };

  if (!Array.isArray(orderedIds)) {
    return Response.json({ error: "orderedIdsは配列で指定してください" }, { status: 400 });
  }

  const db = getDb();
  const now = new Date().toISOString();

  for (let i = 0; i < orderedIds.length; i++) {
    await db
      .update(items)
      .set({ sortOrder: i, updatedAt: now })
      .where(eq(items.id, orderedIds[i]));
  }

  return Response.json({ ok: true });
}
