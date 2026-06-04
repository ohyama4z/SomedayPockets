import type { Item, Lane } from "./types";

const BASE = "/api/items";

export async function fetchItems(lane?: Lane): Promise<Item[]> {
  const url = lane ? `${BASE}?lane=${lane}` : BASE;
  const res = await fetch(url);
  if (!res.ok) throw new Error("アイテムの取得に失敗しました");
  return res.json();
}

export async function createItem(title: string, immediate = false): Promise<Item> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, immediate }),
  });
  if (!res.ok) throw new Error("アイテムの作成に失敗しました");
  return res.json();
}

export async function moveItem(id: string, lane: Lane): Promise<Item> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lane }),
  });
  if (!res.ok) throw new Error("アイテムの移動に失敗しました");
  return res.json();
}

export async function completeItem(id: string, completed: boolean): Promise<Item> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });
  if (!res.ok) throw new Error("アイテムの更新に失敗しました");
  return res.json();
}

export async function reorderItems(orderedIds: string[]): Promise<void> {
  const res = await fetch(`${BASE}/reorder`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderedIds }),
  });
  if (!res.ok) throw new Error("並べ替えに失敗しました");
}

export async function deleteItem(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("アイテムの削除に失敗しました");
}
