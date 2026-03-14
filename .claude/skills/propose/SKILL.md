---
name: propose
description: 運用・プロセス改善の提案をIssueとして起票する。AIが気づいた改善点を提案するときに自律的に呼ぶ
allowed-tools: Bash(gh *), Write, Read
argument-hint: "<提案タイトル> [提案の背景と内容]"
---

# 運用改善提案の起票

$ARGUMENTS の内容から提案Issueを作成する。

## 1. 引数を解析
引数からタイトルと、あれば背景・内容を読み取る。

## 2. Issue本文を作成
`tmp/gh-body.md` に以下の形式で書く：

```markdown
## 提案の背景

（何をしていて、どんな課題・不便を感じたか）

## 提案内容

（具体的に何を変えるか）

## 期待する効果

（改善後にどうなるか）
```

## 3. `proposal` ラベルがなければ作成
```bash
gh label create "proposal" --color "#e4e669" --description "運用・プロセス改善の提案" --repo ohyama4z/SomedayPockets 2>/dev/null || true
```

## 4. Issueを起票
```bash
gh issue create --repo ohyama4z/SomedayPockets --title "<タイトル>" --label "proposal" --body-file tmp/gh-body.md
```

## 5. ユーザーに報告
作成したIssueのURLを伝える。
