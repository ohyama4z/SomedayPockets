import { getDb } from "@/db";
import { items } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  const db = getDb();
  const result = await db.select({ count: sql<number>`count(*)` }).from(items);
  return Response.json({ ok: true, itemCount: result[0].count });
}
