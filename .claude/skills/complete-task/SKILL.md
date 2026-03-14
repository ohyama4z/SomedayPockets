---
name: complete-task
description: 現在の作業ブランチのドラフトPRをReadyにしてmainにマージし、タスクを完了する
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

## 3. 知見の記録
今回のタスクで得られた知見（技術的な学び、判断基準、ハマりポイントなど）があれば、ユーザーへの確認なしに `/save-knowledge` スキルの手順で記録し、コミット・pushする。なければスキップ。

## 4. notes/への記録
今回のタスクで発生した判断経緯・ハマりポイント・調査結果などがあれば、`notes/日付_T番号_タイトル.md` に書き出してコミット・pushする。特筆すべきことがなければスキップ。

## 5. プロセスレビュー
`/review-process` スキルを実行する。見つかった改善点はIssue起票のみ行い、PRマージはブロックしない。

## 6. ドラフトPRをReadyに変更
```bash
gh pr ready --repo ohyama4z/SomedayPockets
```

## 7. PRをマージ
```bash
gh pr merge --merge --repo ohyama4z/SomedayPockets
```
マージによりIssueが自動クローズされる（PR本文の `Closes #番号` による）。

## 8. in-progressラベルを除去
```bash
gh issue edit <番号> --repo ohyama4z/SomedayPockets --remove-label "in-progress"
```

## 9. mainに戻ってブランチを削除
```bash
git checkout main
git pull
git branch -d <ブランチ名>
```

## 10. 報告
- マージされたPRのURL
- クローズされたIssue番号
- プロセスレビューで起票した提案があればそのURL
