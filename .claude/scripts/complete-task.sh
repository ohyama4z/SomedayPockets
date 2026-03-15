#!/bin/bash
# complete-task.sh - タスク完了の定型処理（PRマージ・worktree削除・Issue管理）
# 使い方: bash .claude/scripts/complete-task.sh <Issue番号>

set -euo pipefail

REPO="ohyama4z/SomedayPockets"
ISSUE_NUM="${1:?Issue番号を指定してください}"
WORKTREE_PATH=".claude/worktrees/issue-${ISSUE_NUM}"

echo "=== complete-task: Issue #${ISSUE_NUM} ==="

# --- 1. ブランチ名を特定 ---
if [ -d "$WORKTREE_PATH" ]; then
  BRANCH_NAME=$(git -C "$WORKTREE_PATH" rev-parse --abbrev-ref HEAD)
else
  # worktreeがない場合はブランチ名をパターンで探す
  BRANCH_NAME=$(git branch --list "issue/${ISSUE_NUM}-*" --format='%(refname:short)' | head -1)
fi

if [ -z "$BRANCH_NAME" ]; then
  echo "エラー: Issue #${ISSUE_NUM} に対応するブランチが見つかりません" >&2
  exit 1
fi

echo "ブランチ: ${BRANCH_NAME}"

# --- 2. in-progressラベルを除去 ---
echo "--- in-progressラベルを除去 ---"
gh issue edit "$ISSUE_NUM" --repo "$REPO" --remove-label "in-progress" || true

# --- 3. ドラフトPRをReadyにする ---
echo "--- PRをReadyに変更 ---"
gh pr ready "$BRANCH_NAME" --repo "$REPO"

# --- 4. PRをマージ ---
echo "--- PRをマージ ---"
gh pr merge "$BRANCH_NAME" --merge --repo "$REPO"

# --- 5. Issueのクローズ確認 ---
echo "--- Issueのクローズ確認 ---"
ISSUE_STATE=$(gh issue view "$ISSUE_NUM" --repo "$REPO" --json state --jq .state)
if [ "$ISSUE_STATE" = "OPEN" ]; then
  echo "Issueが自動クローズされなかったため、手動でクローズします"
  gh issue close "$ISSUE_NUM" --repo "$REPO"
fi

# --- 6. worktreeを削除 ---
echo "--- worktreeを削除 ---"
if [ -d "$WORKTREE_PATH" ]; then
  git worktree remove "$WORKTREE_PATH"
else
  echo "worktreeは既に削除されています"
fi

# --- 7. mainに戻ってブランチを整理 ---
echo "--- mainブランチに切り替え・ブランチ削除 ---"
git checkout main
git pull
git branch -d "$BRANCH_NAME" || true

echo "=== 完了 ==="
echo "Issue #${ISSUE_NUM} をクローズしました"
echo "ブランチ ${BRANCH_NAME} を削除しました"
