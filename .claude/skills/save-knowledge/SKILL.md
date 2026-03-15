---
name: save-knowledge
description: 開発知見をknowledge/に記録する
allowed-tools:
  - Bash(ls *)
  - Bash(git add *)
  - Bash(git commit *)
  - Read
  - Write
  - Glob
---

# 知見の記録

CLAUDE.mdの方針に従い、ユーザーへの確認なしで記録する。

## 1. コンテキストを特定
現在のブランチ名からIssue番号を特定する（`issue/番号-xxx` 形式）。
ブランチがmainの場合やIssue番号が取れない場合は、直近の作業コンテキストから推定する。

## 2. 連番を決定
`knowledge/` 配下の既存ファイルから、同じ日付・チケット番号の最大連番を確認し、次の番号を採番する。
```bash
ls knowledge/
```

## 3. ファイルを作成
**1知見1ファイル**で作成する。1つのトピックについて1ファイル。複数の学びがあれば連番を分けて別ファイルにする。

命名規則: `日付_チケット番号_連番_タイトル.md`
- タイトルはその知見を一言で表す具体的な名前にする（例: `GitHub_sub-issue_APIの操作方法`、`Stopフックによる定期プロンプト`）
- 抽象的・包括的な名前は避ける（悪い例: `ClaudeCodeの仕様`、`開発の学び`）

フォーマット:
```markdown
# タイトル

- **日付**: YYYY-MM-DD
- **チケット**: #番号
- **作業**: 作業内容の簡潔な説明

## 知見

（1つのトピックに絞って簡潔に記述）
```

## 4. コミット
```bash
git add knowledge/ファイル名
git commit -m "knowledge: タイトル"
```
