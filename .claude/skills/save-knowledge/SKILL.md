---
name: save-knowledge
description: 開発知見をknowledge/に記録する
disable-model-invocation: true
allowed-tools: Bash(git *), Read, Write, Edit
argument-hint: "[タイトル（省略可）]"
---

# 知見の記録

## 1. コンテキストを特定
現在のブランチ名からIssue番号を特定する（`issue/番号-xxx` 形式）。
ブランチがmainの場合やIssue番号が取れない場合は、ユーザーにチケット番号を確認する。

## 2. 連番を決定
`knowledge/` 配下の既存ファイルから、同じ日付・チケット番号の最大連番を確認し、次の番号を採番する。
```bash
ls knowledge/
```

## 3. 知見の内容をユーザーに確認
引数にタイトルが指定されていればそれを使う。なければユーザーにどんな知見を残すか確認する。

## 4. ファイルを作成
命名規則: `日付_チケット番号_連番_タイトル.md`（例: `2026-03-10_T10_1_docs運用.md`）

フォーマット:
```markdown
# タイトル

- **日付**: YYYY-MM-DD
- **チケット**: #番号
- **作業**: 作業内容の簡潔な説明

## 知見

（学びの内容を簡潔に記述。技術的なTips、判断基準、ハマりポイントなど何でもよい）
```

## 5. コミット
```bash
git add knowledge/ファイル名
git commit -m "knowledge: タイトル"
```
