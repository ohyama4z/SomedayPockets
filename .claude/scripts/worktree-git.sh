#!/bin/bash
# worktree-git.sh - worktreeディレクトリでgitコマンドを実行する
# 使い方: bash .claude/scripts/worktree-git.sh <worktree-path> <git-args...>
# 例: bash .claude/scripts/worktree-git.sh .claude/worktrees/issue-89 status

set -euo pipefail

if [ $# -lt 2 ]; then
  echo "使い方: $0 <worktree-path> <git-args...>" >&2
  exit 1
fi

WORKTREE_PATH="$1"
shift

cd "$WORKTREE_PATH"
git "$@"
