#!/bin/bash
# guard-banned-patterns.sh - prefix一致でallow設定できないコマンドパターンを検出・ブロックする
# PreToolUse (Bash) フックとして使用

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command')

# パターン1: cat > によるファイル作成（リダイレクト付きcat）
if echo "$COMMAND" | grep -qE '^cat\s+>|^cat\s+<<'; then
  jq -n '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "cat > / cat << によるファイル作成は禁止です。ヒアドキュメント直接渡し（--body \"$(cat <<EOF...EOF)\"）またはWriteツールを使ってください。"
    }
  }'
  exit 0
fi

# パターン2: git -C（スクリプト外での直接使用）
if echo "$COMMAND" | grep -qE '^git\s+-C\s'; then
  jq -n '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "git -C の直接使用は禁止です。スクリプト経由で実行するか、worktree内で直接実行してください。"
    }
  }'
  exit 0
fi

# パターン3: gh api（スクリプト外での直接使用）
if echo "$COMMAND" | grep -qE '^gh\s+api\s'; then
  jq -n '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "gh api の直接使用は禁止です。bash .claude/scripts/add-sub-issue.sh 等のスクリプト経由で実行してください。"
    }
  }'
  exit 0
fi

# パターン4: && によるコマンドチェーン
if echo "$COMMAND" | grep -qF '&&'; then
  jq -n '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "&& によるコマンドチェーンは禁止です。コマンドごとにBash呼び出しを分けてください。"
    }
  }'
  exit 0
fi
