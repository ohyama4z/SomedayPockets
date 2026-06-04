export type Lane = "inbox" | "stock" | "next";

export type Item = {
  id: string;
  title: string;
  type: string | null;
  lane: Lane;
  sortOrder: number;
  parentId: string | null;
  priority: number | null;
  deadline: string | null;
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
