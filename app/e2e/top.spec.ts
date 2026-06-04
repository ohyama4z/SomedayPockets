import { test, expect, type Page } from "@playwright/test";

/**
 * 三層構造（インボックス / ストック / ネクスト）の基本動線のE2E。
 *
 * 既存データと衝突しないよう、各テストは一意なタイトルでアイテムを作成し、
 * そのアイテムに限定して検証する。
 */

// 一意なタイトルを生成する
function uniqueTitle(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// キャプチャフォームからアイテムを追加する
async function capture(page: Page, title: string, immediate = false) {
  await page.getByPlaceholder("やりたいことを入力...").fill(title);
  if (immediate) {
    // 「即実行」ラベルを持つフォームのチェックボックスに限定する
    // （ネクストのアイテムカードにもチェックボックスが存在するため）
    await page.getByRole("checkbox", { name: "即実行" }).check();
  }
  await page.getByRole("button", { name: "追加" }).click();
}

test("トップページが表示されタイトルがSomedayPockets", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("SomedayPockets");
  await expect(
    page.getByRole("heading", { name: "SomedayPockets" })
  ).toBeVisible();
  // 三層のうちトップにはインボックスとネクストのレーンが見える
  await expect(page.getByRole("heading", { name: "インボックス" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "ネクスト" })).toBeVisible();
});

test("タイトルのみでキャプチャするとインボックスに表示される", async ({ page }) => {
  await page.goto("/");
  const title = uniqueTitle("inbox");

  await capture(page, title);

  // 追加したアイテムが表示される
  const card = page.getByText(title, { exact: true });
  await expect(card).toBeVisible();

  // インボックスレーン配下に存在することを確認する
  const inboxLane = page
    .locator("div", { has: page.getByRole("heading", { name: "インボックス" }) })
    .first();
  await expect(inboxLane.getByText(title, { exact: true })).toBeVisible();

  // 入力欄はクリアされている
  await expect(page.getByPlaceholder("やりたいことを入力...")).toHaveValue("");
});

test("即実行フラグONでキャプチャするとネクストに入る", async ({ page }) => {
  await page.goto("/");
  const title = uniqueTitle("immediate");

  await capture(page, title, true);

  // ネクストレーン配下に表示される
  const nextLane = page
    .locator("div", { has: page.getByRole("heading", { name: "ネクスト" }) })
    .first();
  await expect(nextLane.getByText(title, { exact: true })).toBeVisible();
});

test("インボックス→ストック→ネクストへ引き上げできる", async ({ page }) => {
  await page.goto("/");
  const title = uniqueTitle("promote");

  // インボックスに作成
  await capture(page, title);
  const card = page.locator("div.group", { hasText: title });
  await expect(card).toBeVisible();

  // ストックへ移動（カードホバーで現れる移動ボタン）
  await card.hover();
  await card.getByRole("button", { name: "ストックへ移動" }).click();

  // インボックスから消える
  await expect(page.getByText(title, { exact: true })).toHaveCount(0);

  // ストックページで確認し、ネクストへ引き上げる
  await page.getByRole("link", { name: "ストック" }).click();
  await expect(page).toHaveURL(/\/stock$/);
  const stockCard = page.locator("div.group", { hasText: title });
  await expect(stockCard).toBeVisible();

  await stockCard.hover();
  await stockCard.getByRole("button", { name: "ネクストへ移動" }).click();

  // ストックから消える
  await expect(page.getByText(title, { exact: true })).toHaveCount(0);

  // トップに戻るとネクストに表示される
  await page.goto("/");
  const nextLane = page
    .locator("div", { has: page.getByRole("heading", { name: "ネクスト" }) })
    .first();
  await expect(nextLane.getByText(title, { exact: true })).toBeVisible();
});

test("ネクストのアイテムを完了できる", async ({ page }) => {
  await page.goto("/");
  const title = uniqueTitle("complete");

  // 即実行でネクストに作成
  await capture(page, title, true);
  const card = page.locator("div.group", { hasText: title });
  await expect(card).toBeVisible();

  // チェックボックスで完了にする。
  // 完了するとカードが「完了済み」エリアへ再配置されるため、
  // `.check()` の状態検証ではなく `.click()` で操作し、結果を検証する。
  await card.getByRole("checkbox").click();

  // 完了済みエリアに移り、取り消し線が付く（line-through クラス）
  const completedSpan = page.locator("span.line-through", { hasText: title });
  await expect(completedSpan).toBeVisible();
});
