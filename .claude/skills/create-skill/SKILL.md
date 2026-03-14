---
name: create-skill
description: 新しいスキルを作成する。SKILL.mdテンプレート生成・必要なpermissionsの確認・settings.jsonへの追記を一括実行
argument-hint: "<スキル名> [説明]"
allowed-tools:
  - Bash(ls *)
  - Bash(mkdir *)
  - Bash(git add *)
  - Bash(git commit *)
  - Bash(git push)
  - Read
  - Write
  - Edit
---

# スキル作成フロー

新しいスキルを `.claude/skills/<スキル名>/SKILL.md` として作成する。

## 1. 引数を解析
引数からスキル名と説明を読み取る。スキルがどんな処理をするか確認し、必要なツール・コマンドを特定する。

## 2. SKILL.mdを作成
```bash
mkdir -p .claude/skills/<スキル名>
```

以下のテンプレートで `.claude/skills/<スキル名>/SKILL.md` を作成する：

```markdown
---
name: <スキル名>
description: <説明>
allowed-tools:
  - <ツール1>
  - <ツール2>
---

# スキルタイトル

スキルの説明。

## 1. ステップ1
...
```

## 3. permissions.allowの確認・更新
`.claude/settings.json` の `permissions.allow` を確認し、新スキルが使うコマンドで未登録のものをリストアップする。

不足しているエントリがある場合は一覧を提示し、ユーザー確認のうえ `.claude/settings.json` に追加する。

## 4. コミット
変更をコミット・pushする（`/save-progress` スキルの手順に従う）。

## 5. 報告
- 作成したスキルファイルのパス
- settings.jsonに追記した権限（あれば）
