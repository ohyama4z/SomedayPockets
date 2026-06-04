#!/bin/bash
# install-git-hooks.sh - ローカルの git pre-commit フックに gitleaks スキャンを設置する。
#
# git の hooksPath（既定: <gitdir>/hooks）に、.claude/hooks/gitleaks-precommit.sh を
# 呼び出す pre-commit フックを設置する。複数回実行しても安全（冪等）。
#
# 実行:
#   bash .claude/hooks/install-git-hooks.sh

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"

# hooksPath が明示設定されていればそれを、無ければ <共通gitdir>/hooks を使う。
HOOKS_PATH="$(git config --get core.hooksPath || true)"
if [ -z "${HOOKS_PATH}" ]; then
  HOOKS_PATH="$(git rev-parse --git-common-dir)/hooks"
fi

mkdir -p "${HOOKS_PATH}"
PRE_COMMIT="${HOOKS_PATH}/pre-commit"

cat > "${PRE_COMMIT}" <<'HOOK'
#!/bin/bash
# 自動生成: gitleaks シークレットスキャンを呼び出す pre-commit フック。
# 実体は .claude/hooks/gitleaks-precommit.sh（リポジトリで管理）。
set -euo pipefail
REPO_ROOT="$(git rev-parse --show-toplevel)"
SCAN="${REPO_ROOT}/.claude/hooks/gitleaks-precommit.sh"
if [ -x "${SCAN}" ]; then
  exec bash "${SCAN}"
fi
HOOK

chmod +x "${PRE_COMMIT}"

echo "✅ pre-commit フックを設置しました: ${PRE_COMMIT}"
echo "   コミット時に .claude/hooks/gitleaks-precommit.sh が gitleaks スキャンを実行します。"
