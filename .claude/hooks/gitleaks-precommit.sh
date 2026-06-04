#!/bin/bash
# gitleaks-precommit.sh - コミット前にステージ済み変更を gitleaks でスキャンするローカルガードレール。
#
# 位置づけ:
#   - 第一防壁は CI（.github/workflows/ci.yml の secret-scan job）。CIは確実にblockする。
#   - 本スクリプトは「ローカルで早期に気付くための補助防壁」。
#   - gitleaks が利用可能なら検知時にコミットをブロックする。
#   - gitleaks が見つからない場合は、無言で素通りさせず明示的に警告して通す（CIで最終担保）。
#
# 有効化:
#   bash .claude/hooks/install-git-hooks.sh
#   （git の hooksPath 配下に本スクリプトを呼ぶ pre-commit を設置する）
#
# gitleaks の検出順: ネイティブバイナリ → docker → なし。

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
CONFIG_ARG=""
if [ -f "${REPO_ROOT}/.gitleaks.toml" ]; then
  CONFIG_ARG="--config=${REPO_ROOT}/.gitleaks.toml"
fi

run_native() {
  # ステージ済み（インデックス）の変更のみをスキャンする
  gitleaks protect --staged --no-banner ${CONFIG_ARG:+$CONFIG_ARG} --source "${REPO_ROOT}"
}

run_docker() {
  docker run --rm -v "${REPO_ROOT}:/repo" -w /repo zricethezav/gitleaks:latest \
    protect --staged --no-banner ${CONFIG_ARG:+--config=/repo/.gitleaks.toml}
}

if command -v gitleaks >/dev/null 2>&1; then
  if ! run_native; then
    echo "❌ gitleaks がステージ済み変更から秘密情報を検知しました。コミットを中止します。" >&2
    echo "   誤検知の場合は .gitleaks.toml の allowlist を見直してください。" >&2
    exit 1
  fi
elif command -v docker >/dev/null 2>&1; then
  if ! run_docker; then
    echo "❌ gitleaks(docker) がステージ済み変更から秘密情報を検知しました。コミットを中止します。" >&2
    echo "   誤検知の場合は .gitleaks.toml の allowlist を見直してください。" >&2
    exit 1
  fi
else
  echo "⚠️  gitleaks も docker も見つからないため、ローカルのシークレットスキャンをスキップしました。" >&2
  echo "   秘密情報の最終チェックは CI（secret-scan job）で行われます。" >&2
  echo "   ローカルでも検知したい場合は gitleaks を導入してください: https://github.com/gitleaks/gitleaks" >&2
fi

exit 0
