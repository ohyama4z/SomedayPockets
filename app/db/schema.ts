import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const laneValues = ["inbox", "stock", "next"] as const;
export type Lane = (typeof laneValues)[number];

export const items = sqliteTable("items", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type", { enum: ["want", "must"] }),
  lane: text("lane", { enum: ["inbox", "stock", "next"] }).notNull().default("inbox"),
  sortOrder: integer("sort_order").notNull().default(0),
  parentId: text("parent_id").references((): ReturnType<typeof text> => items.id),
  priority: integer("priority"),
  deadline: text("deadline"),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
  completedAt: text("completed_at"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
