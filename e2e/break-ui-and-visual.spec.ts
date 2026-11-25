import fs from 'node:fs'
import path from 'node:path'
import { expect, test } from '@playwright/test'

const SCREENSHOT_DIR =
  'C:/Users/RAMESH/.gemini/antigravity/brain/1e5b9b24-7de2-4729-a372-f34841d33647/scratch/screenshots'

test.describe('empty state, reduced motion & visual captures', () => {
  test.beforeAll(() => {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true })
  })

  test('no Demo data / Worst case toggle is present in the DOM', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await expect(page.getByText('Demo data')).toHaveCount(0)
    await expect(page.getByText('Worst case')).toHaveCount(0)
    await expect(page.getByLabel('Open preview stress-test dataset switcher')).toHaveCount(0)
  })

  test('contacts table empty filter state shows recovery action', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    // Move the only Closed Won contact (Hannah Lindqvist) to Discovery, then filter Closed Won
    const actionsBtn = page.getByRole('button', { name: 'Actions for Hannah Lindqvist' })
    await actionsBtn.scrollIntoViewIfNeeded()
    await actionsBtn.click()
    await page.getByRole('menuitem', { name: 'Move Stage' }).click()

    await page.getByRole('button', { name: 'Closed Won', exact: true }).click()
    await expect(page.getByText(/No contacts in .*Closed Won/)).toBeVisible()
    await page.getByRole('button', { name: 'Show all records' }).click()
    await expect(page.getByText('5 records')).toBeVisible()
  })

  test('captures home screenshots and verifies reduced-motion visibility', async ({ page, isMobile }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(300)

    const footerHeading = page.getByRole('heading', { name: /Ready to build better customer relationships/i })
    await expect(footerHeading).toBeVisible()

    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(200)

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, isMobile ? 'home-mobile.png' : 'home-desktop.png'),
      fullPage: true,
    })
  })
})
