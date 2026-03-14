---
name: review-process
description: 第三者視点でプロセス・運用を振り返り、改善提案があれば/proposeで起票する。turn-counterから自動で呼ばれる
allowed-tools: Read, Glob, Bash(ls *), Bash(git log *), Bash(gh issue list *), Bash(find * -name MEMORY.md)
---

# プロセスレビュー

作業者とは別の第三者視点でプロセス・運用を振り返る。
改善できそうな点があれば `/propose` で起票する。なければ一言だけ報告して終わる。

## 1. コンテキストを収集

以下を読み込む：

```bash
# 運用ルール・スキル一覧
cat CLAUDE.md
ls .claude/skills/
```

```bash
# 直近の作業履歴
git log --oneline -20
```

```bash
# 直近のIssue状況
gh issue list --repo ohyama4z/SomedayPockets --state all --limit 10
```

```bash
# 知見・作業ログ
ls knowledge/
ls notes/
```

knowledge/ と notes/ に最近のファイルがあれば内容を読む。

Auto Memoryも参照する（パスは動的に解決）:
```bash
find ~/.claude/projects -name "MEMORY.md" 2>/dev/null
```
見つかったMEMORY.mdと同ディレクトリのファイルを読む。

## 2. 第三者視点でレビュー

以下の観点で評価する。作業者モードを一旦外し、「このチームの開発プロセスを外から見ているエンジニア」として判断する：

- スキルや運用ルールで**繰り返し手作業が発生していないか**
- **曖昧・未定義なルール**があって判断に迷う場面がなかったか
- **情報の揮発**が起きていてセッション再開時にコンテキストが失われそうな箇所はないか
- スキルの**使い勝手・呼び出しタイミング**に改善余地はないか
- ドキュメントに**実態と乖離**が生じていないか

## 3. 提案または報告

**改善点がある場合**: `/propose` スキルを呼んでIssueを起票する。複数あれば複数起票してよい。

**特になければ**: 「✅ プロセスレビュー完了：特に改善点なし」と一言報告する。