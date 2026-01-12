import { test, expect } from '@playwright/test'

test.describe('Casino Categories – Filters + Add Category', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://bo-dev.havanafortuna.com/en/categories')
    await expect(page.getByText('Casino Category')).toBeVisible()
  })

//   ============================
//   FILTER TESTS
//   ============================

  test('should filter categories by name using live search', async ({ page }) => {
    await page.getByRole('button', { name: 'Filters' }).click()

    const searchBox = page.getByPlaceholder('Search')
    await expect(searchBox).toBeVisible()

    await searchBox.fill('Slots')

    const rows = page.locator('tbody tr')
    await expect(rows).toHaveCount(2, { timeout: 10000 })

    const texts = await rows.allTextContents()
    texts.forEach(text => {
      expect(text.toLowerCase()).toContain('slots')
    })
  })

  test('should clear filter and show unfiltered data again', async ({ page }) => {
    await page.getByRole('button', { name: 'Filters' }).click()
    const searchBox = page.getByPlaceholder('Search')

    await searchBox.fill('Slots')

    const rows = page.locator('tbody tr')
    await expect(rows).toHaveCount(2, { timeout: 10000 })

    await searchBox.fill('')
    await page.waitForTimeout(1000)

    const fullCount = await rows.count()
    expect(fullCount).toBeGreaterThan(2)
  })

  // ============================
  // HELPERS
  // ============================

  async function openAddDrawer(page) {
    await page.getByRole('button', { name: 'Add Category' }).click()
    await expect(page.getByRole('heading', { name: 'Add Category' })).toBeVisible()
  }

  async function uploadImages(page) {
    const uploaders = page.locator('input[type="file"]')
    await uploaders.nth(0).setInputFiles('tests/fixtures/desktop.png')
    await uploaders.nth(1).setInputFiles('tests/fixtures/mobile.png')
  }

  // ============================
  // ADD CATEGORY TESTS
  // ============================

  test('should add category in EN as Active', async ({ page }) => {
    await openAddDrawer(page)

    await page.getByPlaceholder('Write your content here...').fill('Test Category EN')
    await uploadImages(page)

    await page.getByRole('switch').click()

    await page.getByRole('button', { name: 'Add Category' }).click()

    await page.waitForTimeout(1500)
    await expect(page.getByText('This field is required')).not.toBeVisible()
  })

  test('should add category in ES as Inactive', async ({ page }) => {
    await openAddDrawer(page)

    await page.getByRole('tab', { name: 'ES' }).click()
    await page.getByPlaceholder('Write your content here...').fill('Categoria Prueba')
    await uploadImages(page)

    await page.getByRole('button', { name: 'Add Category' }).click()

    await page.waitForTimeout(1500)
    await expect(page.getByText('This field is required')).not.toBeVisible()
  })

  test('should NOT submit empty category', async ({ page }) => {
    await openAddDrawer(page)
    await page.getByRole('button', { name: 'Add Category' }).click()
    await expect(page.getByRole('heading', { name: 'Add Category' })).toBeVisible()
  })

  test('should NOT submit without images', async ({ page }) => {
    await openAddDrawer(page)
    await page.getByPlaceholder('Write your content here...').fill('No Image Category')
    await page.getByRole('button', { name: 'Add Category' }).click()
    await expect(page.getByRole('heading', { name: 'Add Category' })).toBeVisible()
  })

  // ============================
  // IMAGE EDGE CASES
  // ============================

  test('should upload desktop and mobile images and show previews', async ({ page }) => {
    await openAddDrawer(page)

    await page.getByPlaceholder('Write your content here...').fill('Image Preview Test')

    const uploaders = page.locator('input[type="file"]')
    await uploaders.nth(0).setInputFiles('tests/fixtures/desktop.png')
    await uploaders.nth(1).setInputFiles('tests/fixtures/mobile.png')

    const previews = page.locator('img')
    const previewCount = await previews.count()
    expect(previewCount).toBeGreaterThan(1)
  })

  test('should submit category only after both images are uploaded', async ({ page }) => {
    await openAddDrawer(page)

    await page.getByPlaceholder('Write your content here...').fill('Submit With Images')

    const uploaders = page.locator('input[type="file"]')

    await uploaders.nth(0).setInputFiles('tests/fixtures/desktop.png')
    await page.getByRole('button', { name: 'Add Category' }).click()
    await expect(page.getByRole('heading', { name: 'Add Category' })).toBeVisible()

    await uploaders.nth(1).setInputFiles('tests/fixtures/mobile.png')
    await page.getByRole('button', { name: 'Add Category' }).click()

    await page.waitForTimeout(1500)
    await expect(page.getByText('This field is required')).not.toBeVisible()
  })

  // ============================
  // COLUMNS
  // ============================

  test.skip('should hide and show columns from Columns menu', async ({ page }) => {
    await page.locator('button:has-text("Columns"), [aria-label="Columns"]').first().click()

    const statusCheckbox = page.locator('label:has-text("Status") input')

    await statusCheckbox.uncheck()
    await expect(page.locator('th:has-text("Status")')).not.toBeVisible()

    await statusCheckbox.check()
    await expect(page.locator('th:has-text("Status")')).toBeVisible()
  })

//   ============================
//   REORDER
//   ============================

//    ============================
//   REORDER (Real Havana BO)
//   ============================

test('should reorder categories using reorder panel and save', async ({ page }) => {

  // Wait main table
  await expect(page.locator('tbody tr').first()).toBeVisible()

  // UI hydration delay (needed – shown in video)
  await page.waitForTimeout(2000)

  // Click Reorder (exact button from screenshot DOM)
  await page.locator('//button[normalize-space()="Reorder"]').click()

  // Wait for Save button → this means panel is open
  const saveBtn = page.locator('//button[normalize-space()="Save"]')
  await expect(saveBtn).toBeVisible({ timeout: 15000 })

  // Grab draggable rows in reorder panel
  const dragItems = page.locator('.drag-cell')
  await expect(dragItems.first()).toBeVisible()

  // Read first name before drag
  const firstNameBefore = await dragItems.nth(0).innerText()

  // Drag first item below second
  await dragItems.nth(0).dragTo(dragItems.nth(1))

  // Save
  await saveBtn.click()

  // Wait for panel to close
  await expect(saveBtn).not.toBeVisible({ timeout: 15000 })

  // Validate table reordered
  const firstNameAfter = await page.locator('tbody tr td:nth-child(2)').first().innerText()
  expect(firstNameAfter).not.toBe(firstNameBefore)
})

test('should deactivate a category using ❌ action button', async ({ page }) => {
  await expect(page.locator('tbody tr').first()).toBeVisible()

  const row = page.locator('tbody tr').first()

  // Read status before
  const statusBefore = await row.getByText(/active|inactive/i).innerText()

  // Click ❌ (first action button)
  await row.locator('button').nth(0).click()

  // Wait for status to change
  await page.waitForTimeout(1500)

  const statusAfter = await row.getByText(/active|inactive/i).innerText()

  expect(statusAfter).not.toBe(statusBefore)
})


test('should toggle category status twice correctly (Active → Inactive → Active)', async ({ page }) => {
  const row = page.locator('tbody tr').first()
  const status = row.getByText(/active|inactive/i)

  // Read initial state
  const initial = (await status.innerText()).trim()

  // Click ❌ first time
  await row.locator('button').nth(0).click()

  // Wait until status text actually changes
  await expect(status).not.toHaveText(initial, { timeout: 10000 })

  const afterFirst = (await status.innerText()).trim()

  // Click ❌ second time
  await row.locator('button').nth(0).click()

  // Wait until it becomes the original again
  await expect(status).toHaveText(initial, { timeout: 10000 })

  const afterSecond = (await status.innerText()).trim()

  expect(afterSecond).toBe(initial)
})

//   =====================================================
//   ADD / REMOVE GAMES
//   =====================================================

  async function getSelectedCount(page) {
    const txt = await page.locator('h2:has-text("Selected Games")').innerText()
    return Number(txt.match(/\d+/)[0])
  }

  async function getAvailableCount(page) {
    const txt = await page.locator('h2:has-text("Available Games")').innerText()
    return Number(txt.match(/\d+/)[0])
  }

  test.skip('remove game using ❌', async ({ page }) => {
    await page.goto('https://bo-dev.havanafortuna.com/en/categories/addGames/36')

    const before = await getSelectedCount(page)

    const card = page.locator('h2:has-text("Selected Games")')
      .locator('div.relative.group').first()

    await card.hover()
    await card.locator('button').click()
    await page.waitForTimeout(2000)

    const after = await getSelectedCount(page)
    expect(after).toBe(before - 1)
  })

  test.skip('add game using ➕', async ({ page }) => {
    await page.goto('https://bo-dev.havanafortuna.com/en/categories/addGames/36')

    const selectedBefore = await getSelectedCount(page)
    const availableBefore = await getAvailableCount(page)

    const card = page.locator('h2:has-text("Available Games")')
      .locator('div.relative.group').first()

    await card.hover()
    await card.locator('button').click()
    await page.waitForTimeout(2000)

    expect(await getSelectedCount(page)).toBe(selectedBefore + 1)
    expect(await getAvailableCount(page)).toBe(availableBefore - 1)
  })


//   pagination

test('should change Rows Per Page correctly', async ({ page }) => {
  const rows = page.locator('tbody tr')

  await page.waitForTimeout(2000)
  await expect(rows.first()).toBeVisible()

  // Click the rows per page dropdown (10)
  await page.locator('text=/Rows per Page/i').locator('..').getByText('10').click()

  // Wait for dropdown to appear
  await page.waitForTimeout(800)

  // Click 20
  await page.getByText('20', { exact: true }).click()

  // Wait for API reload
  await page.waitForTimeout(2000)

  const count = await rows.count()
  expect(count).toBeGreaterThan(10)
  expect(count).toBeLessThanOrEqual(20)
})



test('should move to next page and load different records', async ({ page }) => {
  const firstRow = page.locator('tbody tr').first()
  const firstText = await firstRow.innerText()

  // Click page 2
  await page.getByRole('button', { name: '2' }).click()
  await page.waitForTimeout(1500)

  const secondPageFirst = await page.locator('tbody tr').first().innerText()

  // Must not be same row
  expect(secondPageFirst).not.toBe(firstText)
})

test.skip('should navigate using next and previous pagination arrows', async ({ page }) => {
  await page.waitForTimeout(2000)

  // Ensure page 1 is active
  const page1Btn = page.getByRole('button', { name: '1' })
  await expect(page1Btn).toHaveAttribute('aria-current', /true|page/i)

  // Go to page 2
  await page.getByRole('button', { name: '2' }).click()
  await page.waitForTimeout(2000)

  const page2Btn = page.getByRole('button', { name: '2' })
  await expect(page2Btn).toHaveAttribute('aria-current', /true|page/i)

  // Click PREVIOUS arrow (svg button)
  const prevArrow = page.locator('button').filter({ has: page.locator('svg') }).first()
  await prevArrow.click()
  await page.waitForTimeout(2000)

  // Must be back on page 1
  await expect(page1Btn).toHaveAttribute('aria-current', /true|page/i)

  // Click NEXT arrow
  const nextArrow = page.locator('button').filter({ has: page.locator('svg') }).last()
  await nextArrow.click()
  await page.waitForTimeout(2000)

  // Must be back on page 2
  await expect(page2Btn).toHaveAttribute('aria-current', /true|page/i)
})

})

