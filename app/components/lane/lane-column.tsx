"use client";

import type { Item, Lane } from "@/lib/types";
import { ItemCard } from "./item-card";

type LaneColumnProps = {
  title: string;
  lane: Lane;
  items: Item[];
  onMove?: (id: string, lane: Lane) => void;
  onComplete?: (id: string, completed: boolean) => void;
  onDelete?: (id: string) => void;
  onReorder?: (lane: Lane, fromIndex: number, toIndex: number) => void;
};

export function LaneColumn({
  title,
  lane,
  items,
  onMove,
  onComplete,
  onDelete,
}: LaneColumnProps) {
  const activeItems = items.filter((item) => !item.completed);
  const completedItems = items.filter((item) => item.completed);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">{title}</h2>
        <span className="text-xs text-muted-foreground">{activeItems.length}件</span>
      </div>

      {activeItems.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          アイテムはありません
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        {activeItems.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onMove={onMove}
            onComplete={onComplete}
            onDelete={onDelete}
            showDragHandle={lane === "next"}
          />
        ))}
      </div>

      {completedItems.length > 0 && (
        <div className="mt-2 flex flex-col gap-1.5">
          <p className="text-xs text-muted-foreground">完了済み ({completedItems.length})</p>
          {completedItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onComplete={onComplete}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
