---
name: create-issue
description: Issueを作成する。タイトルと概要を指定すると、テンプレートに沿った本文を生成して投稿する
argument-hint: "<タイトル> [概要や背景の説明]"
allowed-tools:
  - Bash(gh issue create *)
  - Read
  - Write
---

# Issue作成

$ARGUMENTS の内容からIssueを作成する。

## 1. 引数を解析
引数からタイトルと、あれば概要・背景を読み取る。

## 2. Issue本文を作成
以下のテンプレートに沿って `tmp/gh-body.md` に本文を書く。
**すべてのセクション見出しを必ず残す。** 内容がない場合も見出しは省略しない。

```markdown
## 目的 (Why)
<!-- タイトルで自明なら空でよい -->

## やること
<!-- 自明なら空でよい -->

## やらないこと
<!-- 明確にあれば書く -->

## 完了条件
- [ ] ...
```

### 記入ルール
- **完了条件**は必須。具体的・検証可能な条件をチェックリストで書く
- 他のセクションは内容がなければ見出しだけ残して空にする
- ラベルが適切であれば付与する（`epic:〇〇` など）

## 3. Issueを投稿
```bash
gh issue create --repo ohyama4z/SomedayPockets --title "<タイトル>" --body-file tmp/gh-body.md
```

## 4. ユーザーに報告
- 作成されたIssueのURL
