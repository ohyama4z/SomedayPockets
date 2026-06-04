"use client";

import type { Item, Lane } from "@/lib/types";
import { getNextLane, laneLabel } from "@/lib/lane";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, GripVertical, Trash2 } from "lucide-react";

type ItemCardProps = {
  item: Item;
  onMove?: (id: string, lane: Lane) => void;
  onComplete?: (id: string, completed: boolean) => void;
  onDelete?: (id: string) => void;
  showDragHandle?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
};

export function ItemCard({
  item,
  onMove,
  onComplete,
  onDelete,
  showDragHandle,
  dragHandleProps,
}: ItemCardProps) {
  const nextLane = getNextLane(item.lane);

  return (
    <div className="group flex items-center gap-2 rounded-lg border bg-card p-3 text-sm transition-colors hover:bg-muted/50">
      {showDragHandle && (
        <button
          type="button"
          className="touch-none cursor-grab text-muted-foreground active:cursor-grabbing"
          {...dragHandleProps}
        >
          <GripVertical className="size-4" />
        </button>
      )}

      {item.lane === "next" && onComplete && (
        <Checkbox
          checked={item.completed}
          onCheckedChange={(checked) => onComplete(item.id, checked as boolean)}
        />
      )}

      <span className={item.completed ? "flex-1 line-through text-muted-foreground" : "flex-1"}>
        {item.title}
      </span>

      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        {nextLane && onMove && !item.completed && (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onMove(item.id, nextLane)}
            title={laneLabel(nextLane) + "へ移動"}
          >
            <ArrowRight className="size-3.5" />
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onDelete(item.id)}
            title="削除"
          >
            <Trash2 className="size-3.5 text-destructive" />
          </Button>
        )}
      </div>
    </div>
  );
}
