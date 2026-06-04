"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Item, Lane } from "@/lib/types";
import { ItemCard } from "./item-card";

type SortableItemProps = {
  item: Item;
  onComplete?: (id: string, completed: boolean) => void;
  onDelete?: (id: string) => void;
  onMove?: (id: string, lane: Lane) => void;
};

export function SortableItem({ item, onComplete, onDelete, onMove }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <ItemCard
        item={item}
        onComplete={onComplete}
        onDelete={onDelete}
        onMove={onMove}
        showDragHandle
        dragHandleProps={listeners}
      />
    </div>
  );
}
