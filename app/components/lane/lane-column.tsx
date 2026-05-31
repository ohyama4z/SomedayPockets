"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Item, Lane } from "@/lib/types";
import { ItemCard } from "./item-card";
import { SortableItem } from "./sortable-item";

type LaneColumnProps = {
  title: string;
  lane: Lane;
  items: Item[];
  onMove?: (id: string, lane: Lane) => void;
  onComplete?: (id: string, completed: boolean) => void;
  onDelete?: (id: string) => void;
  onReorder?: (activeId: string, overId: string) => void;
};

export function LaneColumn({
  title,
  lane,
  items,
  onMove,
  onComplete,
  onDelete,
  onReorder,
}: LaneColumnProps) {
  const activeItems = items.filter((item) => !item.completed);
  const completedItems = items.filter((item) => item.completed);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id && onReorder) {
      onReorder(active.id as string, over.id as string);
    }
  };

  const renderActiveItems = () => {
    if (activeItems.length === 0) {
      return (
        <p className="py-8 text-center text-sm text-muted-foreground">
          アイテムはありません
        </p>
      );
    }

    if (lane === "next") {
      return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={activeItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-1.5">
              {activeItems.map((item) => (
                <SortableItem
                  key={item.id}
                  item={item}
                  onComplete={onComplete}
                  onDelete={onDelete}
                  onMove={onMove}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      );
    }

    return (
      <div className="flex flex-col gap-1.5">
        {activeItems.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onMove={onMove}
            onComplete={onComplete}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">{title}</h2>
        <span className="text-xs text-muted-foreground">{activeItems.length}件</span>
      </div>

      {renderActiveItems()}

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
