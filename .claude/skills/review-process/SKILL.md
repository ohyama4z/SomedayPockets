---
name: review-process
description: 第三者視点でプロセス・運用を振り返り、大局的な改善提案があれば/proposeで起票する
allowed-tools:
  - Agent
  - Bash(gh issue create *)
  - Read
  - Write
---

# プロセスレビュー

`process-reviewer` サブエージェントを起動し、改善点を分析させる。
改善点があれば `/propose` で起票する。なければ一言報告して終わる。

## 1. process-reviewer サブエージェントを起動

Agentツールで `subagent_type: process-reviewer` を指定して起動する。

## 2. 提案または報告

**改善点がある場合**: サブエージェントの各指摘（最大3件、影響「大」「中」のみ）に対して `/propose` を呼んでIssueを起票する。

**特になければ**: 「プロセスレビュー完了：特に改善点なし」と一言報告する。
