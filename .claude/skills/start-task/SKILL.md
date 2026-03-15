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
Issueに `epic: <名前>` ラベルが付いている場合、CLAUDE.mdの「epic運用」セクションに従ってラベル付与・sub-issue登録を行う。
