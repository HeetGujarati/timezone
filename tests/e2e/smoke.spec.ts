import { expect, test } from '@playwright/test';

/**
 * The smoke suite: the handful of behaviours that, if broken, make the site
 * worthless regardless of what else passes.
 *
 * These run against the built output through `npm run preview`, so they exercise
 * the same HTML, CSS and islands a reader gets. Everything that can be checked
 * without a browser — offsets, transitions, copy, links, metadata — is checked in
 * Vitest or in the audit scripts instead, because those run in seconds and this
 * runs in minutes.
 */

test.describe('the converter', () => {
  test('converts a real time between two zones and shows the difference', async ({ page }) => {
    await page.goto('/');

    // The island replaces the no-JS notice and unhides its controls on upgrade.
    const result = page.locator('[data-out="time"]').first();
    await expect(result).not.toHaveText('—', { timeout: 15_000 });

    await page.selectOption('#convert-from', 'Europe/London');
    await page.selectOption('#convert-to', 'Asia/Kathmandu');
    await page.fill('#convert-date', '2026-06-15');
    await page.fill('#convert-time', '09:00');

    // London is UTC+01:00 in June and Kathmandu is UTC+05:45 all year, a gap of
    // 4 hours 45 minutes: 09:00 becomes 13:45. One assertion covers a 45-minute
    // offset and a daylight-saving offset at once — and it is 13:45 rather than
    // the 14:45 a reader would get from Kathmandu's +05:45 alone, which is the
    // whole point. English reads a 12-hour clock, so 13:45 shows as 01:45 PM.
    await expect(result).toHaveText('01:45 PM', { timeout: 10_000 });
  });

  test('reads the same instant on a 24-hour clock in German', async ({ page }) => {
    await page.goto('/de/');
    const result = page.locator('[data-out="time"]').first();
    await expect(result).not.toHaveText('—', { timeout: 15_000 });

    await page.selectOption('#convert-from', 'Europe/London');
    await page.selectOption('#convert-to', 'Asia/Kathmandu');
    await page.fill('#convert-date', '2026-06-15');
    await page.fill('#convert-time', '09:00');

    // The same conversion as above, on the locale's own hour cycle rather than a
    // hardcoded one — and the difference beside it must be German, not English.
    await expect(result).toHaveText('13:45', { timeout: 10_000 });
    await expect(page.locator('[data-out="difference"]')).toContainText('Stunden');
  });

  test('states what it did with a time that does not exist', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-out="time"]').first()).not.toHaveText('—', {
      timeout: 15_000,
    });

    // 02:30 on the US spring-forward date is skipped by the clocks.
    await page.selectOption('#convert-from', 'America/New_York');
    await page.selectOption('#convert-to', 'Europe/London');
    await page.fill('#convert-date', '2026-03-08');
    await page.fill('#convert-time', '02:30');

    await expect(page.locator('[data-note="gap"]')).toBeVisible({ timeout: 10_000 });
  });
});

test.describe('the meeting planner', () => {
  test('adds and removes a zone, and the band follows', async ({ page }) => {
    await page.goto('/meeting-planner/');

    const zones = page.locator('[data-role="zone-list"] li');
    await expect(zones.first()).toBeVisible({ timeout: 15_000 });
    const before = await zones.count();

    // A zone the prerendered band does not already carry — adding one that is
    // already listed is correctly a no-op.
    await page.selectOption('#planner-add', 'Pacific/Auckland');
    await expect(zones).toHaveCount(before + 1, { timeout: 10_000 });

    await zones.last().getByRole('button').click();
    await expect(zones).toHaveCount(before);
  });
});

test.describe('a generated pair page', () => {
  test('carries its heading, canonical, hreflang cluster and FAQ structured data', async ({
    page,
  }) => {
    await page.goto('/convert/london-to-new-york/');

    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toContainText('London');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute(
      'href',
      /^https:\/\/[^/]+\/convert\/london-to-new-york\/$/,
    );

    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveCount(1);
    await expect(page.locator('link[rel="alternate"][hreflang="de"]')).toHaveCount(1);

    const types = await page.locator('script[type="application/ld+json"]').allTextContents();
    const parsed = types.map((raw) => JSON.parse(raw) as { '@type': string });
    expect(parsed.map((schema) => schema['@type'])).toContain('FAQPage');

    // The 24-row hour table is prerendered, so it must be there without JavaScript.
    // The page carries a second, shorter reference table below it, so this is
    // scoped to the first rather than to every row on the page.
    await expect(page.locator('table').first().locator('tbody tr')).toHaveCount(24);
  });
});

test.describe('locale switching', () => {
  test('moves to the same page in the chosen language and keeps the cluster', async ({ page }) => {
    await page.goto('/convert/london-to-new-york/');
    await page.getByRole('link', { name: 'Deutsch', exact: true }).click();
    await page.waitForURL('**/de/convert/london-to-new-york/');

    await expect(page.locator('html')).toHaveAttribute('lang', 'de');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      /\/de\/convert\/london-to-new-york\/$/,
    );
  });

  test('renders Arabic right to left without overflowing the viewport', async ({ page }) => {
    await page.goto('/ar/meeting-planner/');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, 'the page scrolls horizontally').toBeLessThanOrEqual(1);
  });
});

test.describe('the 404 page', () => {
  test('is a real page that offers a way back', async ({ page }) => {
    const response = await page.goto('/this-route-does-not-exist/');
    // A static host serves 404.html with a 404; the preview server may serve 200.
    expect([200, 404]).toContain(response?.status() ?? 0);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('a[href="/"]').first()).toBeVisible();
  });
});

test.describe('keyboard only', () => {
  test('reaches the converter controls from the skip link without a mouse', async ({ page }) => {
    await page.goto('/');

    await page.keyboard.press('Tab');
    const skip = page.locator('.skip-link');
    await expect(skip).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(page.locator('#main')).toBeFocused();

    // Every interactive control must be reachable; ten tabs is generous for the
    // header plus the first field, and failing here means a focus trap.
    for (let i = 0; i < 12; i += 1) {
      await page.keyboard.press('Tab');
      const id = await page.evaluate(() => document.activeElement?.id ?? '');
      if (id === 'convert-from') return;
    }
    throw new Error('the converter’s first control was not reachable by keyboard');
  });
});
