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
  // CI ではサーバ管理を ci.yml に委ねる（webServer: undefined）。
  // 理由: `next dev` が D1(miniflare) 用に起動する workerd が、Playwright の
  // teardown 時のプロセス kill を生き延び、stdout/stderr の FD を握り続けて
  // webServer の停止処理が無限ハングし、CI ジョブがタイムアウトまで止まる問題があった
  // （出力をファイルへ逃がしても、workerd が孫プロセスとして元の FD を継承し再発）。
  // CI では ci.yml が dev をバックグラウンド起動し wait-on で待機するため、
  // Playwright はサーバを spawn/teardown せず、teardown ハングが原理的に起きない。
  // ローカルでは利便性のため従来どおり Playwright が dev を起動・再利用する。
  webServer: process.env.CI
    ? undefined
    : {
        command: "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: true,
        timeout: 120_000,
        env: {
          NEXT_TELEMETRY_DISABLED: "1",
        },
      },
});
