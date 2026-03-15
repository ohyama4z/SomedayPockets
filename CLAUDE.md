
# SomedayPockets - Claude Code プロジェクト設定

## プロジェクト概要
「やりたいことリスト」管理Webアプリケーション。個人開発。

## ディレクトリ構成
- `docs/spec/` - 仕様ドキュメント（機能別。コードから拾えない情報や機能概要のサマリ）
- `docs/decisions/` - ADR（技術的な意思決定の経緯と理由）
- `knowledge/` - 開発知見（AIの経験値蓄積。このプロダクトのシニアエンジニアとしての判断力の蓄積）
- `notes/` - 作業ログ・調査メモ・たたき台（フロー情報）
- `app/` - アプリケーションコード
- `.claude/` - Claude Code設定

## コミュニケーション
- すべて日本語で行う（会話、コード内コメント、コミットメッセージ含む）
- 変数名・関数名などの識別子は英語

## ドキュメント運用

### ストック情報（時間が経つほど価値が高まる）
- 仕様は `docs/spec/` に機能別ファイルで管理する。コードからぱっと拾えない情報や機能概要のサマリを記載する
- 技術的な意思決定は `docs/decisions/` にADR形式で残す（命名: `NNN-タイトル.md`、テンプレート: `docs/decisions/_template.md`）。ADRを書く際はユーザーに採用/不採用を確認する
- 開発知見は `knowledge/` にトピック別ファイルで書き溜める（命名: `日付_チケット番号_連番_タイトル.md`、例: `2026-03-10_T11_1_docs運用.md`）。知見の読み書きはAIが自律的に行い、ユーザーへの確認は不要
- ドキュメントには確定事項（「何をするか」）のみ残す。不採用の判断（「〇〇はしない」）は載せない（判断経緯はIssueコメントに残す）

### フロー情報（作業中に価値を持ち、時間経過で価値が消える）
- 作業ログ・スパイク調査メモ・たたき台などは `notes/` に残す（命名: `日付_チケット番号_タイトル.md`。チケット横断の場合はチケット番号を省略）
- Issueコメントには作業の要旨・決定事項と `notes/` への参照を記載する。詳細は `notes/` に委ねて読みやすさを保つ
- `notes/` はリポジトリに残し続けるが、明確な参照がない限り見返さない

## タスク運用
- GitHub Issues（ohyama4z/SomedayPockets）でタスクを管理する
- 作業は必ずIssue起点で行う（Issue作成は `/create-issue` スキルで実行する）
- セッション開始時は `gh issue list` でオープンなIssueを確認し、`in-progress` があればコメントから途中経過を把握する
- タスクの着手・完了は `/start-task`・`/complete-task` スキルで実行する
- 作業の途中経過はコミット・Issueコメントでこまめに永続化する

## epic運用
- 複数タスクにまたがる大きな作業単位を「epic」と呼ぶ
- 親Issue: タイトルを `epic: <名前>` とし `epic` ラベルを付ける
- タスク（子Issue）: 通常タイトルとし `epic: <名前>` ラベルを付け、GitHub sub-issue機能で親Issueに紐付ける
- epic完了時: 親Issueをクローズし、完了サマリー（主要な判断経緯・参照ADR・知見リンク）をIssueコメントに残す
- 詳細は `docs/decisions/004-epicを親Issue+ラベルで管理する.md` を参照

## 並行作業（git worktree）
- `/start-task` はworktreeを `.claude/worktrees/issue-<番号>` に自動作成する
- 並行作業の手順:
  1. `/start-task <番号>` を実行する（ブランチ作成・worktree作成・PR作成まで一括）
  2. 別ターミナルで `cd .claude/worktrees/issue-<番号>` → `claude` で作業開始
- worktree削除: `git worktree remove .claude/worktrees/issue-<番号>`
- メインディレクトリは常に `main` ブランチに留める

## 改善提案
- 運用・開発プロセス・Claude Codeの活用方法について、気づいた改善点はその都度積極的に提案する

## コミット運用
- 作業単位ごとに逐一コミットする（コミットメッセージ規則・手順は `/save-progress` スキルに従う）

## 行動原則
- 作業の途中経過をこまめに永続化する（コミット・Issueコメント）。どの時点で離脱しても再開できる状態を保つ
- 迷ったらユーザーに確認する（安全寄りの判断）
- セキュリティの穴を広げる回避策を取らない（権限パターンを緩めるより運用ルールで対応する）
- CLAUDE.md・.claude/ 配下を無断で変更しない（必ず確認を取る）
- コマンドレベル権限設定が適切に働かないため、`&&` を使って複数のコマンドを繋げるのは禁止。必ずコマンドごとにBash呼び出しを分けること。

## 開発ルール
- **言語**: TypeScript（strict mode）
- **フレームワーク**: Next.js (App Router) + React
- **スタイリング**: Tailwind CSS + shadcn/ui
- **DB**: Cloudflare D1 + Drizzle ORM
- **デプロイ**: Cloudflare Pages (@opennextjs/cloudflare)
- **認証**: Cloudflare Access
- 詳細は `docs/spec/技術スタック.md` を参照
