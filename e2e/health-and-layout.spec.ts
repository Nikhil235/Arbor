import { expect, test } from '@playwright/test'

const ROUTES = [
  '/',
  '/product',
  '/pricing',
  '/integrations',
  '/demo',
  '/about',
  '/contact',
  '/security',
  '/help',
  '/help/importing-contacts',
  '/login',
  '/signup',
  '/forgot-password',
]

test.describe('Route health & layout integrity', () => {
  for (const route of ROUTES) {
    test(`loads ${route} cleanly without JS errors or horizontal overflow`, async ({ page }) => {
      const pageErrors: string[] = []
      const consoleErrors: string[] = []

      page.on('pageerror', (err) => pageErrors.push(err.message))
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          const text = msg.text()
          // Ignore network-only resource failures if running offline in a sandboxed environment
          if (!text.includes('ERR_NAME_NOT_RESOLVED') && !text.includes('ERR_INTERNET_DISCONNECTED')) {
            consoleErrors.push(text)
          }
        }
      })

      await page.goto(route, { waitUntil: 'domcontentloaded' })
      await expect(page.locator('h1').first()).toBeVisible()

      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      }))
      expect(overflow.scrollWidth, `${route} horizontal overflow`).toBeLessThanOrEqual(overflow.innerWidth + 1)
      expect(pageErrors, `${route} pageerrors`).toEqual([])
      expect(consoleErrors, `${route} console errors`).toEqual([])
    })
  }

  test('hero botanical backdrop stays absolutely positioned with real height (P0 regression check)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    const heroBackdrop = page.locator('main section').first().locator('> div > div').first()
    const heading = page.locator('h1').first()

    await expect(heading).toBeVisible()
    const metrics = await heroBackdrop.evaluate((el) => {
      const style = window.getComputedStyle(el)
      const rect = el.getBoundingClientRect()
      return {
        position: style.position,
        height: rect.height,
        top: rect.top,
        bottom: rect.bottom,
      }
    })
    const headingRect = await heading.boundingBox()

    expect(metrics.position).toBe('absolute')
    expect(metrics.height).toBeGreaterThan(300)
    expect(headingRect).not.toBeNull()
    expect(headingRect!.y).toBeGreaterThanOrEqual(metrics.top)
    expect(headingRect!.y + headingRect!.height).toBeLessThan(metrics.bottom)
  })
})
