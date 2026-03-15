---
name: propose
description: 運用・プロセス改善の改善点に気づいたとき、提案をIssueとして起票する。AIが自律的に呼ぶ。内部でcreate-issueを呼ぶラッパー
argument-hint: "<提案タイトル> [提案の背景と内容]"
allowed-tools:
  - Bash(gh issue create *)
  - Read
  - Write
---

# 運用改善提案の起票

`create-issue` のラッパー。提案用の内容を整形してから `create-issue` に委譲する。

## 1. 引数を解析
引数からタイトルと、あれば背景・内容を読み取る。

## 2. `/create-issue` を呼ぶ

以下の情報を渡して `/create-issue` スキルを実行する：
- タイトル: 引数のタイトル
- 背景・内容: 引数の背景・内容
- ラベル: `epic: 開発プロセス改善`
- epic: #69 のsub-issueに登録する
- 完了条件の補足: 提案なので「採用/不採用を決定する」を完了条件に含める
