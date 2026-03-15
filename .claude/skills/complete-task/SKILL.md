---
name: complete-task
description: 現在の作業ブランチのドラフトPRをReadyにしてmainにマージし、タスクを完了する
allowed-tools:
  - Bash(bash .claude/scripts/complete-task.sh *)
  - Bash(git status)
  - Bash(git log *)
  - Bash(git -C *)
  - Bash(gh issue view *)
  - Bash(gh issue comment *)
  - Read
  - Write
  - Glob
---

# タスク完了フロー

現在の作業ブランチのドラフトPRをReadyにしてmainにマージする。

## 1. 現在の状態を確認
```bash
git status
git log --oneline main..HEAD
```
未コミットの変更があれば `/save-progress` スキルの手順でコミット・pushする。

## 2. ブランチ名からIssue番号を特定
ブランチ名が `issue/番号-xxx` の形式なので、番号を抽出する。

## 3. epicラベルの確認
Issueに `epic: <名前>` ラベルが付いているか確認する。
```bash
gh issue view <番号> --repo ohyama4z/SomedayPockets
```
epicタスクの場合、ステップ5で完了サマリーの投稿が必要。

## 4. 知見の記録
今回のタスクで得られた知見（技術的な学び、判断基準、ハマりポイントなど）があれば、ユーザーへの確認なしに `/save-knowledge` スキルの手順で記録し、コミット・pushする。なければスキップ。

## 5. notes/への記録・epic完了サマリー
今回のタスクで以下に該当する内容があれば、`notes/日付_T番号_タイトル.md` に書き出してコミット・pushする：
- 複数の選択肢を比較検討して判断した経緯
- 想定外のエラーや障害に遭遇し、調査・解決した過程
- ユーザーとの議論で方針が変わった経緯
- 今後の作業に影響しうる未解決の懸念や制約

該当なしの場合のみスキップ。迷ったら書く。

**epicタスクの場合は必須**: 以下の内容を含む完了サマリーをIssueコメントとして投稿する。
- 主要な判断経緯（何を選び、なぜ選んだか）
- 参照したADR（`docs/decisions/` のファイル名）
- 得られた知見へのリンク（`knowledge/` のファイル名）
- notes/へのリンク（`notes/` のファイル名）

```bash
gh issue comment <番号> --repo ohyama4z/SomedayPockets --body-file tmp/gh-body.md
```

## 6. プロセスレビュー
`/review-process` スキルを実行する。見つかった改善点はIssue起票のみ行い、PRマージはブロックしない。

## 7. 定型処理を実行
in-progressラベル除去・PRをReady・マージ・worktree削除・ブランチ整理を一括実行する：
```bash
bash .claude/scripts/complete-task.sh <番号>
```
マージによりIssueが自動クローズされる（PR本文の `Closes #番号` による）。

## 8. 報告
- マージされたPRのURL
- クローズされたIssue番号
- プロセスレビューで起票した提案があればそのURL
