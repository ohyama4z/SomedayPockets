"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Item, Lane } from "@/lib/types";
import { fetchItems, createItem, moveItem, completeItem, deleteItem, reorderItems } from "@/lib/api";
import { CaptureForm } from "@/components/capture-form/capture-form";
import { LaneColumn } from "@/components/lane/lane-column";
import { Button } from "@/components/ui/button";
import { Archive } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const initialized = useRef(false);

  const reload = useCallback(async () => {
    const data = await fetchItems();
    setItems(data);
  }, []);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    fetchItems().then(setItems);
  }, []);

  const handleCapture = async (title: string, immediate: boolean) => {
    await createItem(title, immediate);
    await reload();
  };

  const handleMove = async (id: string, lane: Lane) => {
    await moveItem(id, lane);
    await reload();
  };

  const handleComplete = async (id: string, completed: boolean) => {
    await completeItem(id, completed);
    await reload();
  };

  const handleDelete = async (id: string) => {
    await deleteItem(id);
    await reload();
  };

  const handleReorder = async (activeId: string, overId: string) => {
    const nextItems = items
      .filter((item) => item.lane === "next" && !item.completed)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    const oldIndex = nextItems.findIndex((i) => i.id === activeId);
    const newIndex = nextItems.findIndex((i) => i.id === overId);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = [...nextItems];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    // 楽観的にUIを更新
    const updatedItems = items.map((item) => {
      const idx = reordered.findIndex((r) => r.id === item.id);
      if (idx !== -1) return { ...item, sortOrder: idx };
      return item;
    });
    setItems(updatedItems);

    await reorderItems(reordered.map((i) => i.id));
  };

  const byLane = (lane: Lane) => {
    const filtered = items.filter((item) => item.lane === lane);
    if (lane === "next") {
      return filtered.sort((a, b) => a.sortOrder - b.sortOrder);
    }
    return filtered;
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">SomedayPockets</h1>
            <Link href="/stock">
              <Button variant="outline" size="sm">
                <Archive className="size-3.5" />
                ストック
              </Button>
            </Link>
          </div>
          <CaptureForm onCapture={handleCapture} />
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <LaneColumn
            title="インボックス"
            lane="inbox"
            items={byLane("inbox")}
            onMove={handleMove}
            onDelete={handleDelete}
          />
          <LaneColumn
            title="ネクスト"
            lane="next"
            items={byLane("next")}
            onComplete={handleComplete}
            onDelete={handleDelete}
            onReorder={handleReorder}
          />
        </div>
      </div>
    </div>
  );
}
