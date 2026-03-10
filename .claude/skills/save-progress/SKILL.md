---
name: save-progress
description: 変更をadd→commit→pushする。コミットメッセージ規則・一時ファイル経由の運用ルールを含む
disable-model-invocation: true
allowed-tools: Bash(git *), Bash(gh *), Write, Read
---

# 変更の保存（add → commit → push）

変更をコミットしてリモートにpushする。

## コミットメッセージ規則
`<種別>: <変更内容の要約> (#Issue番号)`（必要に応じて本文を追記）

種別一覧:
- `feat` - 新機能・新ファイル
- `update` - 既存機能の修正・改善
- `fix` - バグ修正
- `remove` - 機能・ファイルの削除
- `config` - 設定・環境まわり
- `docs` - ドキュメントのみの変更

例: `feat: タスク一覧画面の実装 (#15)`

## 手順

### 1. コミットメッセージを作成
`tmp/commit-msg.txt` にコミットメッセージを書く。

### 2. 変更をステージング
```bash
git add <対象ファイル>
```
`git add` と `git commit` は必ず別々のBash呼び出しで実行する（`&&` で繋げない）。

### 3. コミット
```bash
git commit -F tmp/commit-msg.txt
```

### 4. push
```bash
git push
```

### 5. Issueチェックリストの更新（区切りのタイミングで）
サブタスクが完了した区切りのよいタイミングで、Issueコメントのチェックリストを更新する。毎コミットでは不要。
```bash
gh issue comment <番号> --repo ohyama4z/SomedayPockets --body-file tmp/gh-body.md
```
既存コメントの編集ができない場合は、進捗を新しいコメントとして追記する。

## 運用ルール
- 作業単位ごとに逐一コミットする（ロールバック可能にするため）
- ユーザーの確認なしで自動的にコミットしてよい
- 未pushの大量変更を溜め込まない
- Issueコメント・PR本文は `tmp/gh-body.md` に書いてから `--body-file tmp/gh-body.md` で渡す
