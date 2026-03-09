---
name: start-task
description: Issue番号を指定してタスクに着手する。ブランチ作成・ドラフトPR・ラベル付与・作業計画コメントを一括実行
disable-model-invocation: true
allowed-tools: Bash(git *), Bash(gh *), Read, Write, Edit
argument-hint: "[issue番号]"
---

# タスク着手セットアップ

Issue #$ARGUMENTS に着手する。以下を順に実行：

## 1. Issue内容を確認
```bash
gh issue view $ARGUMENTS --repo ohyama4z/SomedayPockets
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
gh issue edit $ARGUMENTS --repo ohyama4z/SomedayPockets --add-label "in-progress"
```

## 5. 作業計画を立て、Issueにコメント
Issue内容を踏まえて作業計画を立てる。サブタスクはチェックリスト（`- [ ]`）で分解する。
- 粒度が大きいサブタスクは子Issueに切り出し、`- [ ] #番号` でリンクする
- 小さいサブタスクはチェックリストのままで管理する

コメントは `tmp/gh-body.md` に書いてから投稿する：
```bash
gh issue comment $ARGUMENTS --repo ohyama4z/SomedayPockets --body-file tmp/gh-body.md
```

## 6. 初回pushしてドラフトPRを作成
空コミットを作成し、pushしてからドラフトPRを作成する。PR本文に `Closes #番号` を含める：
```bash
git commit --allow-empty -m "chore: Issue #$ARGUMENTS の作業開始"
git push -u origin HEAD
```
PR本文は `tmp/gh-body.md` に書いてから作成する：
```bash
gh pr create --repo ohyama4z/SomedayPockets --draft --title "<タイトル>" --body-file tmp/gh-body.md
```

## 7. ユーザーに報告
- 作成したブランチ名
- ドラフトPRのURL
- 作業計画の概要

## 補足: エピック
大きな単位（機能群、ジャンル）は `epic:〇〇` ラベルで表現する（例: `epic:要件定義`、`epic:運用改善`）。
