#!/bin/bash
# add-sub-issue.sh - 親IssueにサブIssueを登録する
# 使い方: bash .claude/scripts/add-sub-issue.sh <親Issue番号> <子Issue番号>

set -euo pipefail

REPO="ohyama4z/SomedayPockets"
PARENT_NUM="${1:?親Issue番号を指定してください}"
CHILD_NUM="${2:?子Issue番号を指定してください}"

# 親IssueのNode IDを取得
PARENT_ID=$(gh api graphql -f query="query { repository(owner:\"ohyama4z\", name:\"SomedayPockets\") { issue(number:${PARENT_NUM}) { id } } }" --jq '.data.repository.issue.id')

if [ -z "$PARENT_ID" ]; then
  echo "エラー: 親Issue #${PARENT_NUM} のIDを取得できませんでした" >&2
  exit 1
fi

# 子IssueのNode IDを取得
CHILD_ID=$(gh api graphql -f query="query { repository(owner:\"ohyama4z\", name:\"SomedayPockets\") { issue(number:${CHILD_NUM}) { id } } }" --jq '.data.repository.issue.id')

if [ -z "$CHILD_ID" ]; then
  echo "エラー: 子Issue #${CHILD_NUM} のIDを取得できませんでした" >&2
  exit 1
fi

# サブIssueとして登録
gh api graphql -f query="mutation { addSubIssue(input: {issueId: \"${PARENT_ID}\", subIssueId: \"${CHILD_ID}\"}) { issue { id } subIssue { id } } }" --silent

echo "Issue #${CHILD_NUM} を Issue #${PARENT_NUM} のサブIssueに登録しました"
