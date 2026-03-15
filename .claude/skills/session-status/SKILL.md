---
name: session-status
description: セッション開始時にタスク状態・ブランチ状態・直近の作業内容を確認する
allowed-tools:
  - Bash(gh issue list *)
  - Bash(gh issue view *)
  - Bash(ls *)
  - Bash(git status)
  - Bash(git log *)
  - Read
  - Glob
---

# セッション開始チェック

以下を順に実行し、現在の状況をユーザーに報告してください。
`&&`を使って複数のコマンドを繋げるのは禁止。必ずコマンドごとにBash呼び出しを分けること。

## 1. オープンなIssueを確認
```bash
gh issue list --repo ohyama4z/SomedayPockets --state open
```

## 2. 進行中タスクを確認
```bash
gh issue list --repo ohyama4z/SomedayPockets --label "in-progress"
```
in-progressのIssueがあれば、そのコメントを読んで途中経過を把握する：
```bash
gh issue view <番号> --repo ohyama4z/SomedayPockets --comments
```

## 3. 知見を読み込む
`knowledge/INDEX.md` を読み、今回の作業に関連しそうなファイルがあればその本文を読み込む。
INDEXが存在しない場合は `ls knowledge/` にフォールバックする。

## 4. Gitの状態を確認
```bash
git status
git log --oneline -5
```

## 5. 報告
以下をまとめて報告：
- 進行中のタスクとその途中経過
- 未着手のタスク一覧
- 現在のブランチと未コミットの変更
- 推奨する次のアクション

## 補足: 記録の使い分け
各記録の役割を意識して報告する。詳細はCLAUDE.mdの「ドキュメント運用」セクションを参照。
