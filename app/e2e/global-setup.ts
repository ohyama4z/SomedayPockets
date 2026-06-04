import { execFileSync } from "node:child_process";

/**
 * E2E実行前にローカルD1（miniflare）へマイグレーションを適用する。
 *
 * `.wrangler/state` はgit管理外のため、CIではitemsテーブルが存在しない状態から始まる。
 * テスト前にマイグレーションを当てておかないとAPIが500を返し、E2Eが意味をなさなくなる。
 * ローカルで既に適用済みの場合は「No migrations to apply」となり冪等に動作する。
 */
async function globalSetup() {
  const dbName = "someday-pockets-db";
  try {
    execFileSync(
      "npx",
      ["wrangler", "d1", "migrations", "apply", dbName, "--local"],
      { stdio: "inherit" }
    );
  } catch (error) {
    throw new Error(
      `ローカルD1へのマイグレーション適用に失敗しました: ${String(error)}`
    );
  }
}

export default globalSetup;
