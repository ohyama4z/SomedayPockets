#!/bin/bash
# やり取りのカウンターを管理し、N回に1回プロセスレビューを促す

COUNTER_FILE="$(dirname "$0")/../tmp/turn-counter"
mkdir -p "$(dirname "$COUNTER_FILE")"
N=10

count=$(cat "$COUNTER_FILE" 2>/dev/null || echo 0)
count=$((count + 1))

if [ "$count" -ge "$N" ]; then
  echo 0 > "$COUNTER_FILE"
  echo "${N}回のやり取りが経過しました。/review-process を実行してプロセスを振り返ってください。"
else
  echo "$count" > "$COUNTER_FILE"
fi