"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Item, Lane } from "@/lib/types";
import { fetchItems, moveItem, deleteItem } from "@/lib/api";
import { LaneColumn } from "@/components/lane/lane-column";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function StockPage() {
  const [items, setItems] = useState<Item[]>([]);
  const initialized = useRef(false);

  const reload = useCallback(async () => {
    const data = await fetchItems("stock");
    setItems(data);
  }, []);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    fetchItems("stock").then(setItems);
  }, []);

  const handleMove = async (id: string, lane: Lane) => {
    await moveItem(id, lane);
    await reload();
  };

  const handleDelete = async (id: string) => {
    await deleteItem(id);
    await reload();
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <header className="mb-8 flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon-sm">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">ストック</h1>
        </header>

        <LaneColumn
          title="ストック"
          lane="stock"
          items={items}
          onMove={handleMove}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
