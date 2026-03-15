# allowed-toolsはランタイム未強制

- **日付**: 2026-03-14
- **チケット**: #28
- **作業**: 運用提案スキル・プロセスレビュースキルの作成

## 知見

SKILL.mdのフロントマターに `allowed-tools` を書いても、現時点ではランタイムでツール使用が制限されない（[claude-code#18837](https://github.com/anthropics/claude-code/issues/18837)）。
宣言的ドキュメントとしてのみ機能する。実行制御は `settings.json` の `permissions` で行うこと。
→ バグ修正後に方針を見直す。
