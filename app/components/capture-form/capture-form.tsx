"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

type CaptureFormProps = {
  onCapture: (title: string, immediate: boolean) => void;
};

export function CaptureForm({ onCapture }: CaptureFormProps) {
  const [title, setTitle] = useState("");
  const [immediate, setImmediate] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onCapture(trimmed, immediate);
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <Input
        placeholder="やりたいことを入力..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1"
        autoFocus
      />
      <label className="flex items-center gap-1.5 text-sm text-muted-foreground whitespace-nowrap">
        <Checkbox
          checked={immediate}
          onCheckedChange={(checked) => setImmediate(checked as boolean)}
        />
        即実行
      </label>
      <Button type="submit" disabled={!title.trim()}>
        追加
      </Button>
    </form>
  );
}
