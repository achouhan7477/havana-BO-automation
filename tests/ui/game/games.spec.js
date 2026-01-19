import { test, expect } from '@playwright/test'

test.describe('Casino Games – Toggles, Status, Pagination', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://bo-dev.havanafortuna.com/en/games', { waitUntil: 'networkidle' })
    await expect(page.getByRole('heading', { name: 'Games' })).toBeVisible()
    await page.waitForSelector('tbody tr')
    await page.waitForTimeout(2000)
  })

  // -------------------------------
  // FEATURED TOGGLE
  // -------------------------------
  test('should toggle Featured ON and OFF', async ({ page }) => {
    const toggle = page.locator('tbody tr').first().locator('td').nth(0).locator('button')

    await toggle.click()
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    await toggle.click()
    await page.waitForLoadState('networkidle')
  })

  // -------------------------------
  // NEW GAME TOGGLE
  // -------------------------------
  test('should toggle New Game ON and OFF', async ({ page }) => {
    const toggle = page.locator('tbody tr').first().locator('td').nth(3).locator('button')

    await toggle.click()
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    await toggle.click()
    await page.waitForLoadState('networkidle')
  })

  // -------------------------------
  // ACTIVE / INACTIVE STATUS
  // -------------------------------
  // test('should toggle game status Active ↔ Inactive', async ({ page }) => {
  //   const row = page.locator('tbody tr').first()

  //   // Click Active
  //   const activeBtn = row.getByText('Active')
  //   await activeBtn.click()
  //   await page.waitForLoadState('networkidle')
  //   await page.waitForTimeout(2000)

  //   // Re-locate row after React refresh
  //   const newRow = page.locator('tbody tr').first()
  //   const inactiveBtn = newRow.getByText(/inactive/i)
  //   await expect(inactiveBtn).toBeVisible()

  //   await inactiveBtn.click()
  //   await page.waitForLoadState('networkidle')
  //   await page.waitForTimeout(2000)

  //   const finalRow = page.locator('tbody tr').first()
  //   await expect(finalRow.getByText('Active')).toBeVisible()
  // })

  // -------------------------------
  // ROWS PER PAGE
  // -------------------------------
  test('should change Rows Per Page to 15', async ({ page }) => {
    const paginator = page.locator('text=Rows per Page').locator('..')
    const dropdown = paginator.locator('button')

    await dropdown.click()
    await page.waitForTimeout(1000)

    await page.getByRole('option', { name: '15' }).click()
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    const rows = await page.locator('tbody tr').count()
    expect(rows).toBeLessThanOrEqual(15)
  })

  // -------------------------------
  // PAGINATION NEXT
  // -------------------------------
  // test('should move to next page and load different games', async ({ page }) => {
  //   const rows = page.locator('tbody tr')
  //   const firstRowText = await rows.first().innerText()

  //   // Wait for paginator to render
  //   const paginator = page.locator('nav, [role="navigation"]').last()
  //   await expect(paginator).toBeVisible()

  //   const nextBtn = paginator.locator('button').filter({ hasText: /next|>/i }).first()
  //   await expect(nextBtn).toBeVisible()
  //   await nextBtn.click()

  //   await page.waitForLoadState('networkidle')
  //   await page.waitForTimeout(2000)

  //   const secondPageFirstRow = await page.locator('tbody tr').first().innerText()
  //   expect(secondPageFirstRow).not.toBe(firstRowText)
  // })

})
