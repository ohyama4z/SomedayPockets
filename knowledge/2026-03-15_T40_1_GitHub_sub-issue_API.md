# GitHub sub-issue APIの操作方法

- **日付**: 2026-03-15
- **チケット**: #40
- **作業**: epic管理の定義・運用方法整備

## 知見

### sub-issueの概要
- 2025年4月にGA（一般提供開始）、無料プランで利用可能
- 最大8階層のネストが可能（1親につき子は最大100件）
- 親Issue上でsub-issueの完了率が自動集計される

### gh CLIからの操作
`gh issue` コマンドにはsub-issueのネイティブサポートがないため、REST APIを `gh api` で叩く必要がある。

```bash
# 子IssueのinterlなID（issue番号≠内部ID）を取得
CHILD_ID=$(gh api repos/ohyama4z/SomedayPockets/issues/<子番号> --jq .id)

# 親IssueにサブIssueとして登録
gh api repos/ohyama4z/SomedayPockets/issues/<親番号>/sub_issues \
  -X POST -F sub_issue_id=$CHILD_ID
```

**注意**: `--jq .id` で取れるのは内部数値ID（例: 12345678）で、issue番号（#40など）とは別物。

