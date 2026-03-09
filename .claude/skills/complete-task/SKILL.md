---
name: complete-task
description: 現在の作業ブランチからPRを作成してタスクを完了する
disable-model-invocation: true
allowed-tools: Bash(git *), Bash(gh *)
---

# タスク完了フロー

現在の作業ブランチの変更をPRにしてmainにマージする。

## 1. 現在の状態を確認
```bash
git status
git log --oneline main..HEAD
```
未コミットの変更があればコミットする。

## 2. リモートにpush
```bash
git push -u origin HEAD
```

## 3. ブランチ名からIssue番号を特定
ブランチ名が `issue/番号-xxx` の形式なので、番号を抽出する。

## 4. PRを作成
変更内容を分析し、PRのタイトルと本文を作成する。本文に `Closes #番号` を含める：
```bash
gh pr create --base main --title "<タイトル>" --body "<本文（Closes #番号 を含む）>"
```

## 5. PRをマージ
```bash
gh pr merge --merge
```

## 6. mainに戻ってブランチを削除
```bash
git checkout main
git pull
git branch -d <ブランチ名>
```

## 7. ユーザーに報告
- マージされたPRのURL
- クローズされたIssue番号