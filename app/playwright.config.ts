import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  // E2E実行前にローカルD1へマイグレーションを適用する
  globalSetup: "./e2e/global-setup.ts",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    // dev サーバの出力はファイルへ逃がす。
    // `next dev` は D1(miniflare) 用に workerd を子プロセスとして起動するが、
    // この workerd は teardown 時のプロセスグループ kill を生き延びることがある。
    // 出力を Playwright のパイプに繋いだままだと、生き残った workerd が
    // stdout/stderr の FD を握り続け、子プロセスの "close" イベントが発火せず、
    // webServer の停止処理が無限に待ち続けて CI がタイムアウトまでハングする。
    // ファイルへリダイレクトしておけば、workerd が生き残ってもファイルFDを握るだけで、
    // Playwright 側のパイプは確実に閉じるため teardown が正常に完了する。
    command: "npm run dev > dev-server.log 2>&1",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    // 起動待ちの上限を明示（既定の60秒では取り違えが起きうるため明示）
    timeout: 120_000,
    env: {
      // telemetry のデタッチドプロセス（detached-flush）の起動を抑止する
      NEXT_TELEMETRY_DISABLED: "1",
    },
  },
});
