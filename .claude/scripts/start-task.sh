#!/bin/bash
# start-task.sh - タスク着手の定型処理（ブランチ作成・worktree・PR作成）
# 使い方: bash .claude/scripts/start-task.sh <Issue番号>

set -euo pipefail

REPO="ohyama4z/SomedayPockets"
ISSUE_NUM="${1:?Issue番号を指定してください}"

# --- 危険コマンドのガード ---
# このスクリプト自体は安全な操作のみ行うが、念のためシェル環境を制限
# （スクリプト内では外部入力をコマンドとして実行しないため問題ない）

# --- 1. Issueタイトルを取得してブランチ名を生成 ---
ISSUE_TITLE=$(gh issue view "$ISSUE_NUM" --repo "$REPO" --json title --jq .title)
if [ -z "$ISSUE_TITLE" ]; then
  echo "エラー: Issue #${ISSUE_NUM} のタイトルを取得できませんでした" >&2
  exit 1
fi

# タイトルをslugify: 小文字化、英数字以外をハイフンに、連続ハイフン統合、先頭末尾ハイフン除去
SLUG=$(echo "$ISSUE_TITLE" \
  | tr '[:upper:]' '[:lower:]' \
  | sed 's/[^a-z0-9]/-/g' \
  | sed 's/-\+/-/g' \
  | sed 's/^-//;s/-$//' \
  | cut -c1-50)

BRANCH_NAME="issue/${ISSUE_NUM}-${SLUG}"
WORKTREE_PATH=".claude/worktrees/issue-${ISSUE_NUM}"

echo "=== start-task: Issue #${ISSUE_NUM} ==="
echo "ブランチ: ${BRANCH_NAME}"
echo "worktree: ${WORKTREE_PATH}"

# --- 2. mainブランチを最新にする ---
echo "--- mainブランチを最新化 ---"
git checkout main
git pull

# --- 3. ブランチとworktreeを作成 ---
echo "--- ブランチとworktreeを作成 ---"
git branch "$BRANCH_NAME" main
git worktree add "$WORKTREE_PATH" "$BRANCH_NAME"

# --- 4. in-progressラベルを付与 ---
echo "--- in-progressラベルを付与 ---"
gh issue edit "$ISSUE_NUM" --repo "$REPO" --add-label "in-progress"

# --- 5. 空コミットを作成してpush ---
echo "--- 初回push ---"
git -C "$WORKTREE_PATH" commit --allow-empty -m "chore: Issue #${ISSUE_NUM} の作業開始"
git -C "$WORKTREE_PATH" push -u origin HEAD

# --- 6. ドラフトPRを作成 ---
echo "--- ドラフトPRを作成 ---"
PR_BODY="## Summary
${ISSUE_TITLE}

Closes #${ISSUE_NUM}"

PR_URL=$(gh pr create \
  --repo "$REPO" \
  --head "$BRANCH_NAME" \
  --draft \
  --title "${ISSUE_TITLE}" \
  --body "$PR_BODY")

echo "=== 完了 ==="
echo "PR: ${PR_URL}"
echo "worktree: ${WORKTREE_PATH}"
echo "ブランチ: ${BRANCH_NAME}"
