# Next.js App Router から D1 への接続

- `@opennextjs/cloudflare` の `getCloudflareContext()` で `env.DB` を取得
- `drizzle(env.DB, { schema })` で Drizzle インスタンスを生成
- ローカル開発では `next.config.ts` で `initOpenNextCloudflareForDev()` の呼び出しが必要
- `env.d.ts` で `CloudflareEnv` インターフェースに `DB: D1Database` を宣言して型を通す
