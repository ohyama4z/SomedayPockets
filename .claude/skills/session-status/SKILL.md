---
name: session-status
description: セッション開始時にタスク状態・ブランチ状態・直近の作業内容を確認する
disable-model-invocation: true
allowed-tools: Read, Bash(git *), Bash(gh *)
---

# セッション開始チェック

以下を順に実行し、現在の状況をユーザーに報告してください。

## 1. オープンなIssueを確認
```bash
gh issue list --repo ohyama4z/MyQuest --state open
```

## 2. 進行中タスクを確認
```bash
gh issue list --repo ohyama4z/MyQuest --label "in-progress"
```
in-progressのIssueがあれば、そのコメントを読んで途中経過を把握する：
```bash
gh issue view <番号> --repo ohyama4z/MyQuest --comments
```

## 3. Gitの状態を確認
```bash
git status
git log --oneline -5
```

## 4. 報告
以下をまとめて報告：
- 進行中のタスクとその途中経過
- 未着手のタスク一覧
- 現在のブランチと未コミットの変更
- 推奨する次のアクション