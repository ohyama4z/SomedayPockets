---
name: start-task
description: Issue番号を指定してタスクに着手する。ブランチ作成・ドラフトPR・ラベル付与・作業計画コメントを一括実行
argument-hint: "[issue番号]"
allowed-tools:
  - Bash(gh issue view *)
  - Bash(gh issue edit *)
  - Bash(gh issue comment *)
  - Bash(gh pr create *)
  - Bash(git checkout *)
  - Bash(git pull)
  - Bash(git branch *)
  - Bash(git commit *)
  - Bash(git push)
  - Bash(git push *)
  - Bash(git worktree *)
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

## 2. mainブランチを最新にする
```bash
git checkout main
git pull
```

## 3. 作業ブランチとworktreeを作成
Issueのタイトルから簡潔な英語名をつける。ブランチを作成し、worktreeを切る：
```bash
git branch issue/$ARGUMENTS-<簡潔な名前> main
git worktree add .claude/worktrees/issue-$ARGUMENTS issue/$ARGUMENTS-<簡潔な名前>
```
以降の操作（コミット・push等）はworktreeディレクトリ内で実行する。
- worktreeのパス: `.claude/worktrees/issue-$ARGUMENTS`
- Bashコマンドには `-C` オプション（`git -C <path>`）か、`--git-dir` を使ってworktree内で実行する

## 4. in-progressラベルを付与
```bash
gh issue edit $ARGUMENTS --repo ohyama4z/SomedayPockets --add-label "in-progress"
```

## 5. 知見を読み込む
`knowledge/` 配下のファイル一覧を確認し、今回のタスクに参考になりそうな知見があれば読み込む。
```bash
ls knowledge/
```
関連しそうなファイルがあれば内容を読み、作業計画に活かす。

## 6. 作業計画を立て、Issueにコメント
Issue内容を踏まえて作業計画を立てる。サブタスクはチェックリスト（`- [ ]`）で分解する。
- 粒度が大きいサブタスクは子Issueに切り出し、`- [ ] #番号` でリンクする
- 小さいサブタスクはチェックリストのままで管理する

コメントは `tmp/gh-body.md` に書いてから投稿する：
```bash
gh issue comment $ARGUMENTS --repo ohyama4z/SomedayPockets --body-file tmp/gh-body.md
```

## 7. 初回pushしてドラフトPRを作成
worktreeディレクトリ内で空コミットを作成し、pushしてからドラフトPRを作成する：
```bash
git -C .claude/worktrees/issue-$ARGUMENTS commit --allow-empty -m "chore: Issue #$ARGUMENTS の作業開始"
git -C .claude/worktrees/issue-$ARGUMENTS push -u origin HEAD
```
PR本文は `.github/pull_request_template.md` をベースに `tmp/gh-body.md` に書いてから作成する：
```bash
gh pr create --repo ohyama4z/SomedayPockets --draft --title "<タイトル>" --body-file tmp/gh-body.md
```

## 8. ユーザーに報告
- 作成したブランチ名
- ドラフトPRのURL
- 作業計画の概要
- worktreeパス（別ターミナルで `cd <path>` → `claude` で並行作業可能）

## 補足: epic

### epicとは
複数タスクにまたがる大きな作業単位。

### epicの構造
- 親Issue: タイトルを `epic: <名前>`、ラベルは `epic`
- 子Issue（タスク）: 通常タイトル、ラベルは `epic: <名前>`

### epicに属するタスクを着手する場合
1. `epic: <名前>` ラベルをIssueに付与する
2. GitHub sub-issue機能で親epicにタスクを登録する：
```bash
CHILD_ID=$(gh api repos/ohyama4z/SomedayPockets/issues/<子番号> --jq .id)
gh api repos/ohyama4z/SomedayPockets/issues/<親番号>/sub_issues \
  -X POST -F sub_issue_id=$CHILD_ID
```

### 新しいepicを立ち上げる場合
1. 親Issueを `epic: <名前>` タイトルで作成し `epic` ラベルを付ける
2. `epic: <名前>` ラベルを新規作成する（存在しない場合）：
```bash
gh label create "epic: <名前>" --repo ohyama4z/SomedayPockets --color "<color>"
```
