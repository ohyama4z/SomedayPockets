#!/bin/bash
# complete-task.sh - タスク完了の定型処理（情報収集・CI待機・PRマージ・worktree削除・Issue管理）
# 使い方:
#   bash .claude/scripts/complete-task.sh <Issue番号>          完了処理を実行する
#   bash .claude/scripts/complete-task.sh <Issue番号> --info   情報収集のみ行い実行はしない（dry-run）
#
# --info はスキル側がブランチ名・Issue状態・epicラベルを一括把握するために使う。
# 実行モードでも冒頭で同じ情報をまとめて表示してから処理を進める。

set -euo pipefail

REPO="ohyama4z/SomedayPockets"
ISSUE_NUM="${1:?Issue番号を指定してください}"
MODE="${2:-run}"
WORKTREE_PATH=".claude/worktrees/issue-${ISSUE_NUM}"

# ============================================================
# 情報収集フェーズ: 完了処理に必要な情報を1回でまとめて取得・表示する
# ============================================================

# --- ブランチ名を特定 ---
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

# --- Issueの状態・タイトル・epicラベルをまとめて取得 ---
ISSUE_JSON=$(gh issue view "$ISSUE_NUM" --repo "$REPO" --json state,title,labels)
ISSUE_STATE=$(echo "$ISSUE_JSON" | jq -r .state)
ISSUE_TITLE=$(echo "$ISSUE_JSON" | jq -r .title)
EPIC_LABELS=$(echo "$ISSUE_JSON" | jq -r '[.labels[].name | select(startswith("epic:"))] | join(", ")')
if [ -n "$EPIC_LABELS" ]; then
  IS_EPIC="yes"
else
  IS_EPIC="no"
  EPIC_LABELS="(なし)"
fi

cat <<EOF
=== complete-task: Issue #${ISSUE_NUM} ===
タイトル      : ${ISSUE_TITLE}
ブランチ      : ${BRANCH_NAME}
worktree      : $([ -d "$WORKTREE_PATH" ] && echo "$WORKTREE_PATH" || echo "(なし)")
Issue状態     : ${ISSUE_STATE}
epicタスクか  : ${IS_EPIC} (${EPIC_LABELS})
EOF

# --info モードでは情報表示だけで終了する（スキルが事前把握に使う）
if [ "$MODE" = "--info" ]; then
  echo "--- 情報収集のみ（--info）。完了処理は実行しません ---"
  if [ "$IS_EPIC" = "yes" ]; then
    echo "注意: epicタスクのため、完了処理の前に完了サマリーをIssueコメントに投稿すること"
  fi
  exit 0
fi

# ============================================================
# 実行フェーズ: ラベル整理 → CI待機 → マージ → 後片付け
# ============================================================

# --- in-progressラベルを除去 ---
echo "--- in-progressラベルを除去 ---"
gh issue edit "$ISSUE_NUM" --repo "$REPO" --remove-label "in-progress" || true

# --- ドラフトPRをReadyにする ---
echo "--- PRをReadyに変更 ---"
gh pr ready "$BRANCH_NAME" --repo "$REPO"

# --- CIの完了を待つ（失敗ならここで中断してマージしない） ---
echo "--- CIの完了を待機 ---"
gh pr checks "$BRANCH_NAME" --repo "$REPO" --watch --fail-fast

# --- PRをマージ ---
echo "--- PRをマージ ---"
gh pr merge "$BRANCH_NAME" --merge --repo "$REPO"

# --- Issueのクローズ確認（PR本文の Closes #番号 で自動クローズされる想定） ---
echo "--- Issueのクローズ確認 ---"
ISSUE_STATE=$(gh issue view "$ISSUE_NUM" --repo "$REPO" --json state --jq .state)
if [ "$ISSUE_STATE" = "OPEN" ]; then
  echo "Issueが自動クローズされなかったため、手動でクローズします"
  gh issue close "$ISSUE_NUM" --repo "$REPO"
fi

# --- worktreeを削除 ---
echo "--- worktreeを削除 ---"
if [ -d "$WORKTREE_PATH" ]; then
  git worktree remove "$WORKTREE_PATH"
else
  echo "worktreeは既に削除されています"
fi

# --- mainに戻ってブランチを整理 ---
echo "--- mainブランチに切り替え・ブランチ削除 ---"
git checkout main
git pull
git branch -d "$BRANCH_NAME" || true

echo "=== 完了 ==="
echo "Issue #${ISSUE_NUM} をクローズしました"
echo "ブランチ ${BRANCH_NAME} を削除しました"
