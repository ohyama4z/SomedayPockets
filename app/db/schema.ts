import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const items = sqliteTable("items", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type", { enum: ["want", "must"] }).notNull(),
  parentId: text("parent_id").references((): ReturnType<typeof text> => items.id),
  priority: integer("priority"),
  deadline: text("deadline"),
  completed: integer("completed").notNull().default(0),
  completedAt: text("completed_at"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
