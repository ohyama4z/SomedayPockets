# ADR-004: ✅ epicを親Issue+ラベルで管理する
<!-- ファイル名: 004-epicを親Issue+ラベルで管理する.md -->

- **日付**: 2026-03-14
- **ステータス**: ✅ 承認済み
- **チケット**: #40

## コンテキスト

複数のタスクにまたがる大きな作業単位（epic）の管理方法が未定義だった。
タスク完了時に判断経緯のサマリーを残す運用（#37）を実装するにあたり、「epicとは何か」「いつ完了したか」を明確にする必要があった。

## 検討した選択肢

### 選択肢A: 親Issue + ラベル + GitHub sub-issue機能
- **pros**: epic完了の検出が明確（親Issueをクローズ）、チェックリスト不要（sub-issueで進捗自動集計）、gh CLI + REST APIで操作可能
- **cons**: Issueを作るだけでなくsub-issue登録が必要（`gh api` 2ステップ）

### 選択肢B: 全子Issueに `epic:〇〇` ラベルのみ付与
- **pros**: 軽い、フィルタで一覧できる
- **cons**: epic完了の検出が難しい、親がいないので完了サマリーを書くタイミングが曖昧

### 選択肢C: GitHub Milestone
- **pros**: 進捗率が自動計算される
- **cons**: `gh issue` コマンドでMilestone操作ができず `gh api` が必須、操作コストが高い

## 決定

**選択肢Aを採用する。**

### 運用ルール

**epicの構造:**
- 親Issue: タイトルを `epic: <名前>` とし、`epic` ラベルを付ける
- タスク（子Issue）: 通常のタイトルとし、`epic: <名前>` ラベルを付ける

**epic管理のコマンド:**
```bash
# epicラベルの作成（epic新設時）
gh label create "epic: <名前>" --repo ohyama4z/SomedayPockets --color "<color>"

# タスクIssueを親epicのsub-issueとして登録
CHILD_ID=$(gh api repos/ohyama4z/SomedayPockets/issues/<子番号> --jq .id)
gh api repos/ohyama4z/SomedayPockets/issues/<親番号>/sub_issues \
  -X POST -F sub_issue_id=$CHILD_ID

# epicのタスク一覧
gh issue list --repo ohyama4z/SomedayPockets --label "epic: <名前>"

# epic一覧
gh issue list --repo ohyama4z/SomedayPockets --label "epic"
```

**epic完了:**
- タスクが全て完了したら親Issueをクローズする
- クローズ時に完了サマリーをIssueコメントとして残す（#37 参照）

### 理由

epic完了の検出を明確にするために親Issueが必要。
GitHub sub-issue機能により親Issue本文のチェックリスト管理が不要になり、二重管理を回避できる。
ラベルを子Issueに付けることで `gh issue list --label` によるフィルタも使える。
