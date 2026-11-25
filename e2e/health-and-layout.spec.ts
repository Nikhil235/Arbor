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

const IMAGE_ROUTES = [
  '/',
  '/product',
  '/pricing',
  '/integrations',
  '/about',
  '/security',
  '/help',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
]

const AUTH_ROUTES = new Set(['/login', '/signup', '/forgot-password', '/reset-password'])

test.describe('Image integrity', () => {
  for (const route of IMAGE_ROUTES) {
    test(`loads all visible botanical backdrop images cleanly on ${route}`, async ({ page, isMobile }) => {
      const failedImages: string[] = []

      page.on('response', (res) => {
        if (res.request().resourceType() === 'image' && res.status() >= 400) {
          failedImages.push(`${res.status()} ${res.url()}`)
        }
      })
      page.on('requestfailed', (req) => {
        if (req.resourceType() === 'image') {
          failedImages.push(`FAILED ${req.url()} (${req.failure()?.errorText ?? 'unknown'})`)
        }
      })

      await page.goto(route, { waitUntil: 'networkidle' })
      await expect(page.locator('h1').first()).toBeVisible()

      const backdrops = page.locator('[data-botanical-backdrop]')
      const count = await backdrops.count()
      expect(count, `${route} expected at least one backdrop`).toBeGreaterThan(0)

      for (let i = 0; i < count; i++) {
        const backdrop = backdrops.nth(i)
        if (await backdrop.isVisible()) {
          await backdrop.scrollIntoViewIfNeeded()
        }
      }

      const minExpectedVisible = isMobile && AUTH_ROUTES.has(route) ? 0 : 1

      await expect
        .poll(
          async () =>
            page.evaluate((minExpected) => {
              const els = Array.from(document.querySelectorAll('[data-botanical-backdrop]'))
              const visible = els.filter((el) => {
                const r = el.getBoundingClientRect()
                return r.width > 0 && r.height > 0
              })
              if (visible.length < minExpected) {
                return { ok: false, reason: `expected >= ${minExpected} visible backdrops, got ${visible.length}` }
              }
              for (const el of visible) {
                const img = el.querySelector('img')
                if (!img) return { ok: false, reason: 'missing img in backdrop' }
                if (!img.complete || img.naturalWidth === 0) {
                  return { ok: false, reason: `unloaded img: ${img.src}` }
                }
              }
              return { ok: true, visibleCount: visible.length }
            }, minExpectedVisible),
          { timeout: 15_000 },
        )
        .toMatchObject({ ok: true })

      expect(failedImages, `${route} failed image requests`).toEqual([])
    })
  }

  test('client-side navigation from /product to /about renders /about hero image cleanly', async ({ page }) => {
    await page.goto('/product', { waitUntil: 'networkidle' })
    const aboutLink = page.locator('footer a[href="/about"]')
    await aboutLink.scrollIntoViewIfNeeded()
    await aboutLink.click()
    await expect(page).toHaveURL(/\/about$/)

    await expect
      .poll(
        async () =>
          page.evaluate(() => {
            const img = document.querySelector('main [data-botanical-backdrop] img') as HTMLImageElement | null
            return Boolean(img && img.complete && img.naturalWidth > 0)
          }),
        { timeout: 15_000 },
      )
      .toBe(true)
  })
})
