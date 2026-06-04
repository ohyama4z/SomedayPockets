---
name: complete-task
description: 現在の作業ブランチのドラフトPRをReadyにしてmainにマージし、タスクを完了する
allowed-tools:
  - Bash(bash .claude/scripts/complete-task.sh *)
  - Bash(git status)
  - Bash(git log *)
  - Bash(gh issue comment *)
  - Read
  - Glob
---

# タスク完了フロー

現在の作業ブランチのドラフトPRをReadyにしてmainにマージする。

## 1. 状態確認と情報収集
未コミットの変更がないか確認する。
```bash
git status
git log --oneline main..HEAD
```
未コミットの変更があれば `/save-progress` スキルの手順でコミット・pushしてから先へ進む。

ブランチ名（`issue/番号-xxx` 形式）からIssue番号を特定し、`--info` モードで完了処理に必要な情報（ブランチ・Issue状態・epicラベル）を一括取得する：
```bash
bash .claude/scripts/complete-task.sh <番号> --info
```
出力に「epicタスクか: yes」と表示されたら、ステップ3で完了サマリーの投稿が必要。

## 2. 振り返り（知見・notesの記録）
今回のタスクを振り返り、次の **どちらかの基準に該当する内容があれば記録する**。該当しなければスキップする（迷ったら記録しない）。

- **(A) 30分以上ハマった問題**: 原因と解決策。`/save-knowledge` スキルの手順で `knowledge/` に記録する
- **(B) 次回同種タスクで参照したい情報**: 再利用できる手順・判断基準・技術的な学びは `/save-knowledge` で `knowledge/` に、判断の経緯や調査メモなどフロー情報は `notes/日付_T番号_タイトル.md` に記録する

記録した場合はコミット・pushする。

## 3. epic完了サマリー（epicタスクのみ）
epicタスクの場合のみ、以下を含む完了サマリーをIssueコメントとして投稿する。epicでなければスキップ。
- 主要な判断経緯（何を選び、なぜ選んだか）
- 参照したADR（`docs/decisions/` のファイル名）・知見（`knowledge/` のファイル名）・notes（`notes/` のファイル名）へのリンク

```bash
gh issue comment <番号> --repo ohyama4z/SomedayPockets --body "$(cat <<'EOF'
<コメント本文>
EOF
)"
```

## 4. 完了処理を実行
in-progressラベル除去・PRをReady化・CI完了の待機・mainへのマージ・Issueクローズ確認・worktree削除・ブランチ整理を一括実行する：
```bash
bash .claude/scripts/complete-task.sh <番号>
```
- CIが失敗するとスクリプトはマージ前に中断する（安全のため）。CIを修正してから再実行する。
- マージによりIssueが自動クローズされる（PR本文の `Closes #番号` による）。

## 5. 報告
- マージされたPRのURL
- クローズされたIssue番号
- 記録した知見/notesがあればそのファイル名
