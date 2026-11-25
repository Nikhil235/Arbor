import { expect, test } from '@playwright/test'

test.describe('Interactive behavior, a11y & state flows', () => {
  test('header transitions to sticky translucent bar on scroll (desktop)', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'Desktop scroll header test')
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    const header = page.locator('header')
    await expect(header).not.toHaveClass(/border-b/)

    await page.evaluate(() => window.scrollTo(0, 360))
    await expect(header).toHaveClass(/border-b/)
    await expect(header).toHaveClass(/bg-canvas\/85/)
  })

  test('mobile menu has >= 44px target, focuses close on open, and restores focus on Escape', async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, 'Mobile menu test')
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    const openBtn = page.getByRole('button', { name: 'Open menu' })
    const box = await openBtn.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.width).toBeGreaterThanOrEqual(44)
    expect(box!.height).toBeGreaterThanOrEqual(44)

    await openBtn.click()
    const dialog = page.getByRole('dialog', { name: 'Site menu' })
    await expect(dialog).toBeVisible()
    await expect(page.getByRole('button', { name: 'Close menu' })).toBeFocused()

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(openBtn).toBeFocused()
  })

  test('HeroDashboardPreview tabs, live search, automations switch, and keyboard chart work', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    const previewNav = page.getByRole('navigation', { name: 'CRM Preview Navigation' })

    await previewNav.getByRole('button', { name: 'Pipeline' }).click()
    await expect(page.getByRole('heading', { name: 'Sales Pipeline' })).toBeVisible()

    await previewNav.getByRole('button', { name: 'Automations' }).click()
    await expect(page.getByRole('heading', { name: 'Workflow Automations' })).toBeVisible()
    const firstSwitch = page.getByRole('switch').first()
    const wasChecked = await firstSwitch.getAttribute('aria-checked')
    await firstSwitch.click()
    await expect(firstSwitch).toHaveAttribute('aria-checked', wasChecked === 'true' ? 'false' : 'true')
    await expect(page.getByRole('status').filter({ hasText: /enabled|paused/i }).first()).toBeVisible()

    await previewNav.getByRole('button', { name: 'Analytics' }).click()
    await expect(page.getByRole('heading', { name: 'Stage Conversion' })).toBeVisible()

    const searchInput = page.getByLabel('Search CRM preview')
    await searchInput.fill('Linden')
    await page.getByRole('button', { name: /Elena Rostova Linden Bio/i }).click()
    await expect(page.getByRole('heading', { name: 'Contacts', exact: true })).toBeVisible()

    await previewNav.getByRole('button', { name: 'Dashboard' }).click()
    await expect(page.getByRole('heading', { name: 'Good morning, Sarah.' })).toBeVisible()

    const chart = page.getByRole('img', { name: 'Revenue performance area chart' })
    const sepPoint = chart.getByRole('button', { name: /Sep:/i })
    await sepPoint.focus()
    await expect(sepPoint).toHaveAttribute('aria-pressed', 'true')
    await page.keyboard.press('ArrowRight')
    await expect(chart.getByRole('button', { name: /Oct:/i })).toHaveAttribute('aria-pressed', 'true')
  })

  test('WorkflowContactsPreview flips bottom-row menu cleanly and supports Sonner Undo', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    const actionsBtn = page.getByRole('button', { name: 'Actions for Sora Takahashi' })
    await actionsBtn.scrollIntoViewIfNeeded()
    await actionsBtn.click()

    const menu = page.getByRole('menu')
    await expect(menu).toBeVisible()

    const menuBox = await menu.boundingBox()
    const btnBox = await actionsBtn.boundingBox()
    expect(menuBox).not.toBeNull()
    expect(btnBox).not.toBeNull()
    // Bottom row flips upward above the trigger button
    expect(menuBox!.y).toBeLessThan(btnBox!.y)

    await menu.getByRole('menuitem', { name: 'Move Stage' }).click()
    const toast = page.getByRole('status').filter({ hasText: /Moved Sora Takahashi to/i }).first()
    await expect(toast).toBeVisible()

    await toast.getByRole('button', { name: 'Undo' }).click()
    const soraRow = page.locator('tr', { hasText: 'Sora Takahashi' })
    await expect(soraRow).toContainText('Follow-up')
  })

  test('FAQ accordion toggles aria-expanded and inert cleanly', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    const firstFaqBtn = page.getByRole('button', { name: /How do we move our existing customer data into Arbor/i })
    await firstFaqBtn.scrollIntoViewIfNeeded()

    await expect(firstFaqBtn).toHaveAttribute('aria-expanded', 'true')
    await firstFaqBtn.click()
    await expect(firstFaqBtn).toHaveAttribute('aria-expanded', 'false')

    const panelId = await firstFaqBtn.getAttribute('aria-controls')
    const panel = page.locator(`#${panelId}`)
    await expect(panel).toHaveAttribute('aria-hidden', 'true')
    await expect(panel.locator('> div')).toHaveAttribute('inert', '')
  })

  test('Pricing radiogroup supports keyboard ArrowRight switching', async ({ page }) => {
    await page.goto('/pricing', { waitUntil: 'domcontentloaded' })
    const yearlyRadio = page.getByRole('radio', { name: /Yearly/i })
    const monthlyRadio = page.getByRole('radio', { name: /Monthly/i })

    await expect(yearlyRadio).toHaveAttribute('aria-checked', 'true')
    await expect(page.getByText('$24')).toBeVisible()

    await yearlyRadio.focus()
    await page.keyboard.press('ArrowRight')
    await expect(monthlyRadio).toHaveAttribute('aria-checked', 'true')
    await expect(page.getByText('$29')).toBeVisible()
  })

  test('Demo form ErrorSummary jumps focus to ChoiceGroup and ForgotPassword validates', async ({ page }) => {
    await page.goto('/demo', { waitUntil: 'domcontentloaded' })
    await page.getByRole('button', { name: 'Request demo' }).click()

    const alert = page.getByRole('alert')
    await expect(alert).toBeVisible()
    await alert.getByRole('link', { name: 'Team size' }).click()
    await expect(page.locator('#field-teamSize')).toBeFocused()

    await page.goto('/forgot-password', { waitUntil: 'domcontentloaded' })
    await page.getByRole('button', { name: 'Send reset link' }).click()
    await expect(page.getByRole('alert')).toBeVisible()
  })

  test('Help and Integrations URL-synced filters and breadcrumbs work', async ({ page }) => {
    await page.goto('/help', { waitUntil: 'domcontentloaded' })
    const helpSearch = page.getByLabel('Search help articles')
    await helpSearch.fill('import')
    await expect(page).toHaveURL(/q=import/)

    await page.getByRole('button', { name: 'Clear help search' }).click()
    await expect(page).not.toHaveURL(/q=import/)

    await page.goto('/help/importing-contacts', { waitUntil: 'domcontentloaded' })
    await page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', { name: 'Contacts & data' }).click()
    await expect(page).toHaveURL(/\/help\?category=Contacts/)
    await expect(page.getByRole('heading', { name: 'Contacts & data' })).toBeVisible()

    await page.goto('/integrations', { waitUntil: 'domcontentloaded' })
    await page.getByRole('button', { name: 'Revenue', exact: true }).click()
    await expect(page).toHaveURL(/category=Revenue/)
    await expect(page.getByText('3 integrations')).toBeVisible()
  })
})
