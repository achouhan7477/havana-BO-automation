import { test, expect } from '@playwright/test'

test.describe('Casino Categories - Filters', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://bo-dev.havanafortuna.com/en/categories')
    await expect(page.getByText('Casino Category')).toBeVisible()
  })

  test('should filter categories by name using live search', async ({ page }) => {

    // Open Filters
    await page.getByRole('button', { name: 'Filters' }).click()

    // Search input appears
    const searchBox = page.getByPlaceholder('Search')
    await expect(searchBox).toBeVisible()

    // Type filter
    await searchBox.fill('Slots')

    const rows = page.locator('tbody tr')

    // Wait until filtered (your real data = 2 rows)
    await expect(rows).toHaveCount(2, { timeout: 10000 })

    // Validate every row contains "Slots"
    const texts = await rows.allTextContents()
    texts.forEach(text => {
      expect(text.toLowerCase()).toContain('slots')
    })
  })


  test('should clear filter and show unfiltered data again', async ({ page }) => {

    // Open Filters
    await page.getByRole('button', { name: 'Filters' }).click()
    const searchBox = page.getByPlaceholder('Search')

    // Apply filter
    await searchBox.fill('Slots')

    const rows = page.locator('tbody tr')
    await expect(rows).toHaveCount(2, { timeout: 10000 })

    // Clear filter (live input)
    await searchBox.fill('')

    // Wait for table to repopulate
    await page.waitForTimeout(1000)

    const fullCount = await rows.count()
    expect(fullCount).toBeGreaterThan(2)
  })

})
