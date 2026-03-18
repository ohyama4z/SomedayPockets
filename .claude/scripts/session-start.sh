#!/bin/bash
# session-start.sh - セッション開始時にタスク状態を自動出力する
# SessionStartフックから呼ばれる

set -euo pipefail

REPO="ohyama4z/SomedayPockets"

echo "=== セッション状態 ==="

# in-progressタスクの確認
echo ""
echo "--- 進行中のタスク ---"
IN_PROGRESS=$(gh issue list --repo "$REPO" --label "in-progress" --json number,title --jq '.[] | "#\(.number) \(.title)"' 2>/dev/null || echo "(取得失敗)")
if [ -z "$IN_PROGRESS" ]; then
  echo "なし"
else
  echo "$IN_PROGRESS"
fi

# gitブランチ状態
echo ""
echo "--- ブランチ ---"
echo "$(git branch --show-current)"

# 未コミット変更
echo ""
echo "--- 未コミット変更 ---"
CHANGES=$(git status --short 2>/dev/null || echo "(取得失敗)")
if [ -z "$CHANGES" ]; then
  echo "なし"
else
  echo "$CHANGES"
fi

# 直近のコミット
echo ""
echo "--- 直近のコミット ---"
git log --oneline -3 2>/dev/null || echo "(取得失敗)"

echo ""
echo "リマインダー: /loop 10m /review-process を実行してください"
