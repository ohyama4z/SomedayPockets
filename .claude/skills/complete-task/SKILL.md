---
name: complete-task
description: 現在の作業ブランチのドラフトPRをReadyにしてmainにマージし、タスクを完了する
disable-model-invocation: true
allowed-tools: Bash(git *), Bash(gh *), Write, Read
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

## 4. ドラフトPRをReadyに変更
```bash
gh pr ready --repo ohyama4z/SomedayPockets
```

## 5. PRをマージ
```bash
gh pr merge --merge --repo ohyama4z/SomedayPockets
```
マージによりIssueが自動クローズされる（PR本文の `Closes #番号` による）。

## 6. mainに戻ってブランチを削除
```bash
git checkout main
git pull
git branch -d <ブランチ名>
```

## 7. ユーザーに報告
- マージされたPRのURL
- クローズされたIssue番号
