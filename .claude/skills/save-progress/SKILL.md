---
name: save-progress
description: 変更をadd→commit→pushする。コミットメッセージ規則・一時ファイル経由の運用ルールを含む
allowed-tools:
  - Bash(git status)
  - Bash(git diff *)
  - Bash(git diff)
  - Bash(git add *)
  - Bash(git commit *)
  - Bash(git push)
  - Bash(git push *)
  - Bash(gh issue comment *)
  - Read
  - Write
---

# 変更の保存（add → commit → push）

変更をコミットしてリモートにpushする。

## コミットメッセージ規則
`<プレフィックス>: <変更内容の要約> (#Issue番号)`（必要に応じて本文を追記）

プレフィックスには変更対象を端的に表す1語を使う（自由記述）。

よく使うプレフィックス:
- `feat` / `fix` / `update` / `remove` - アプリケーションコードの変更
- `skill` - スキルファイルの変更
- `knowledge` - 知見ファイルの変更
- `docs` - ドキュメントの変更
- `config` - CLAUDE.mdや設定ファイルの変更
- `settings` - settings.jsonの変更
- `script` - スクリプトの変更
- `chore` - 定型作業（作業開始の空コミット等）
- `revert` - 変更の取り消し

例: `skill: complete-taskにIssueクローズ確認ステップを追加 (#44)`

## 手順
`&&`を使って複数のコマンドを繋げるのは禁止。必ずコマンドごとにBash呼び出しを分けること。

### 1. コミットメッセージを自動生成
`git status` と `git diff` を読んで変更内容を把握し、コミットメッセージ規則に従ったドラフトを生成して `tmp/commit-msg.txt` に書く。

### 2. 判断経緯・ハマりポイントの記録（該当する場合のみ）
今回のコミットに関連する判断経緯・ハマりポイント・調査結果などがあれば、`notes/日付_T番号_タイトル.md` に書き出す。特筆すべきことがなければスキップ。

### 3. 変更をステージング
```bash
git add <対象ファイル>
```

### 4. コミット
```bash
git commit -F tmp/commit-msg.txt
```

### 5. push
```bash
git push
```

### 6. Issueチェックリストの更新（区切りのタイミングで）
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
