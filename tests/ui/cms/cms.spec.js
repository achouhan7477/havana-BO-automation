import { test, expect } from '@playwright/test'

test.describe('CMS LIST – Filters, Toggle, Actions', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://bo-dev.havanafortuna.com/en/cms')

    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(3000)

    await expect(page.getByRole('heading', { name: 'CMS' })).toBeVisible()
  })

  // ================================
  // FILTER TEST
  // ================================

  test('should filter CMS using search', async ({ page }) => {

    await page.getByRole('button', { name: 'Filters' }).click()
    await page.waitForTimeout(1000)

    const search = page.getByPlaceholder('Search by slug or title')
    await search.fill('faq')
    await page.waitForTimeout(2000)

    await expect(page.locator('tbody tr').first()).toContainText('faq')
  })

  // ================================
  // STATUS TOGGLE ACTIVE ↔ INACTIVE
  // ================================

// update here and cover all the edge cases


  // ================================
  // CREATE CMS BUTTON WORKING
  // ================================

  test('should navigate to Create CMS page', async ({ page }) => {

    await page.getByRole('button', { name: 'Create CMS' }).click()
    await page.waitForTimeout(2000)

    await expect(page.locator('input[placeholder="Enter Slug"]')).toBeVisible()
  })

  // ================================
  // VIEW ACTION
  // ================================
  test('should open CMS View page', async ({ page }) => {

    const row = page.locator('tbody tr').first()

    await row.hover()
    await page.waitForTimeout(1000)

    const viewBtn = row.locator('a[href*="view"]')

    await viewBtn.click()

    await expect(
      page.getByText('View CMS')
    ).toBeVisible()
  })

  // ================================
  // EDIT ACTION (DRAWER BASED)
  // ================================

  test('should open CMS Edit drawer', async ({ page }) => {

    const row = page.locator('tbody tr').first()

    await row.hover()
    await page.waitForTimeout(1000)

    const editBtn = row.locator('a[href*="update"]')

    await editBtn.click()

    await expect(
      page.locator('input[placeholder="Enter Slug"]')
    ).toBeVisible()
  })

  // ================================
  // INACTIVE ACTION
  // ================================

  test('should deactivate CMS from list', async ({ page }) => {

    const row = page.locator('tbody tr').first()

    await row.hover()
    await page.waitForTimeout(1000)

    const inactiveBtn = row.locator('button').nth(2)

    await inactiveBtn.click()
    await page.waitForTimeout(2000)
  })

  // ================================
  // DELETE ACTION
  // ================================

  test('should delete CMS from list', async ({ page }) => {

    const row = page.locator('tbody tr').first()

    await row.hover()
    await page.waitForTimeout(1000)

    const deleteBtn = row.locator('button').nth(3)

    await deleteBtn.click()
    await page.waitForTimeout(2000)

    const confirm = page.getByRole('button', { name: /yes|confirm|delete/i })

    if (await confirm.isVisible()) {
      await confirm.click()
    }

    await page.waitForTimeout(2000)
  })

})
