---
name: start-task
description: Issue番号を指定してタスクに着手する。ブランチ作成・ドラフトPR・ラベル付与・作業計画コメントを一括実行
argument-hint: "[issue番号]"
allowed-tools:
  - Bash(bash .claude/scripts/start-task.sh *)
  - Bash(gh issue view *)
  - Bash(gh issue comment *)
  - Bash(ls *)
  - Read
  - Write
  - Glob
---

# タスク着手セットアップ

Issue #$ARGUMENTS に着手する。以下を順に実行：

## 1. Issue内容を確認
```bash
gh issue view $ARGUMENTS --repo ohyama4z/SomedayPockets
```

## 2. 定型処理を実行
ブランチ作成・worktree作成・in-progressラベル付与・初回push・ドラフトPR作成を一括実行する：
```bash
bash .claude/scripts/start-task.sh $ARGUMENTS
```

## 3. 知見を読み込む
`knowledge/` 配下のファイル一覧を確認し、今回のタスクに参考になりそうな知見があれば読み込む。
```bash
ls knowledge/
```
関連しそうなファイルがあれば内容を読み、作業計画に活かす。

## 4. 作業計画を立て、Issueにコメント
Issue内容を踏まえて作業計画を立てる。サブタスクはチェックリスト（`- [ ]`）で分解する。
- 粒度が大きいサブタスクは子Issueに切り出し、`- [ ] #番号` でリンクする
- 小さいサブタスクはチェックリストのままで管理する

コメントは `tmp/gh-body.md` に書いてから投稿する：
```bash
gh issue comment $ARGUMENTS --repo ohyama4z/SomedayPockets --body-file tmp/gh-body.md
```

## 5. ユーザーに報告
- 作成したブランチ名
- ドラフトPRのURL
- 作業計画の概要
- worktreeパス（別ターミナルで `cd <path>` → `claude` で並行作業可能）

## 補足: epic
Issueに `epic: <名前>` ラベルが付いている場合、CLAUDE.mdの「epic運用」セクションに従ってラベル付与・sub-issue登録を行う。
