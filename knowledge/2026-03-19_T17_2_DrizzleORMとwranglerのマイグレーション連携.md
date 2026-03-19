# Drizzle ORM と wrangler のマイグレーション連携

- `drizzle-orm`（本体）と `drizzle-kit`（マイグレーションツール、devDependency）をインストール
- `drizzle.config.ts` で `dialect: "sqlite"` を指定（D1 は SQLite ベース）
- スキーマは `drizzle-orm/sqlite-core` の `sqliteTable` で定義
- 自己参照FK: `.references(() => テーブル.カラム)` で定義可能
- Drizzle のデフォルト出力先は `drizzle/`、wrangler のデフォルトは `migrations/` → wrangler.jsonc の `migrations_dir` を `"drizzle"` に指定して合わせる
- `npx drizzle-kit generate` で SQL 生成
- `npx wrangler d1 migrations apply <db名> --remote` でリモート適用
- `npx wrangler d1 migrations apply <db名>` でローカル適用
