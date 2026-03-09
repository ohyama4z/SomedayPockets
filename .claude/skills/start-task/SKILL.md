---
name: start-task
description: Issue番号を指定してタスクに着手する。ブランチ作成・ラベル付与・作業計画コメントを一括実行
disable-model-invocation: true
allowed-tools: Bash(git *), Bash(gh *), Read
argument-hint: "[issue番号]"
---

# タスク着手セットアップ

Issue #$ARGUMENTS に着手する。以下を順に実行：

## 1. Issue内容を確認
```bash
gh issue view $ARGUMENTS --repo ohyama4z/MyQuest
```

## 2. mainブランチを最新にする
```bash
git checkout main
git pull
```

## 3. 作業ブランチを作成
Issueのタイトルから簡潔な英語名をつける：
```bash
git checkout -b issue/$ARGUMENTS-<簡潔な名前>
```

## 4. in-progressラベルを付与
```bash
gh issue edit $ARGUMENTS --repo ohyama4z/MyQuest --add-label "in-progress"
```

## 5. 作業計画をIssueにコメント
Issue内容を踏まえて作業計画を立て、コメントとして投稿する：
```bash
gh issue comment $ARGUMENTS --repo ohyama4z/MyQuest --body "## 作業計画\n\n- ..."
```

## 6. ユーザーに報告
- 作成したブランチ名
- 作業計画の概要