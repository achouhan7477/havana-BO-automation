import { test, expect } from '@playwright/test'

test.describe('CMS CREATE – EDGE CASES', () => {

  async function openCreateDrawer(page) {
    await page.goto('https://bo-dev.havanafortuna.com/en/cms')

    await page.waitForResponse(res =>
      res.url().includes('/cms') &&
      res.request().method() === 'GET'
    )

    await page.getByRole('button', { name: 'Create CMS' }).click()

    await page.waitForSelector('input[placeholder="Enter Slug"]')
  }

  async function fillMandatory(page, slug = 'test-slug-1') {

    await page.locator('input[placeholder="Enter Slug"]').fill(slug)
    await page.locator('input[placeholder="Enter Title"]').fill('test')

    await page.locator('text=Category').locator('..').click()
    await page.waitForSelector('[role="option"]')
    await page.getByRole('option', { name: 'Legal Compliance' }).click()

    const editor = page.locator('.rdw-editor-main')
    await editor.click()
    await page.keyboard.type('Dummy CMS content for testing purpose')
  }

  // ======================================
  // TC1 – VALID CREATE
  // ======================================
  test('should create CMS successfully', async ({ page }) => {

    const slug = 'test-slug-1'

    await openCreateDrawer(page)
    await fillMandatory(page, slug)

    await page.getByRole('button', { name: /create cms/i }).click()

    await page.waitForSelector('input[placeholder="Enter Slug"]', {
      state: 'detached'
    })

    const row = page.locator('tbody tr').filter({ hasText: slug })

    await expect(row).toBeVisible()
  })

  // ======================================
  // TC2 – DUPLICATE SLUG
  // ======================================
  test('should show error for duplicate slug', async ({ page }) => {

    await openCreateDrawer(page)
    await fillMandatory(page, 'test-slug-1')

    await page.getByRole('button', { name: /create cms/i }).click()

    await expect(
      page.locator('input[placeholder="Enter Slug"]')
    ).toBeVisible()
  })

  // ======================================
  // TC3 – EMPTY SLUG
  // ======================================
  test('should show validation for empty slug', async ({ page }) => {

    await openCreateDrawer(page)
    await fillMandatory(page)

    await page.locator('input[placeholder="Enter Slug"]').fill('')

    await page.getByRole('button', { name: /create cms/i }).click()

    await expect(
      page.locator('input[placeholder="Enter Slug"]')
    ).toBeVisible()
  })

  // ======================================
  // TC4 – EMPTY TITLE
  // ======================================
  test('should show validation for empty title', async ({ page }) => {

    await openCreateDrawer(page)
    await fillMandatory(page)

    await page.locator('input[placeholder="Enter Title"]').fill('')

    await page.getByRole('button', { name: /create cms/i }).click()

    await expect(
      page.locator('input[placeholder="Enter Slug"]')
    ).toBeVisible()
  })

  // ======================================
  // TC5 – EMPTY CONTENT
  // ======================================
  test('should show validation for empty content', async ({ page }) => {

    await openCreateDrawer(page)

    await page.locator('input[placeholder="Enter Slug"]').fill('test-slug-2')
    await page.locator('input[placeholder="Enter Title"]').fill('test')

    await page.locator('text=Category').locator('..').click()
    await page.waitForSelector('[role="option"]')
    await page.getByRole('option', { name: 'Legal Compliance' }).click()

    await page.getByRole('button', { name: /create cms/i }).click()

    await expect(
      page.locator('input[placeholder="Enter Slug"]')
    ).toBeVisible()
  })

  // ======================================
  // TC6 – CATEGORY NOT SELECTED
  // ======================================
  test('should show validation for category', async ({ page }) => {

    await openCreateDrawer(page)

    await page.locator('input[placeholder="Enter Slug"]').fill('test-slug-3')
    await page.locator('input[placeholder="Enter Title"]').fill('test')

    const editor = page.locator('.rdw-editor-main')
    await editor.click()
    await page.keyboard.type('dummy')

    await page.getByRole('button', { name: /create cms/i }).click()

    await expect(
      page.locator('input[placeholder="Enter Slug"]')
    ).toBeVisible()
  })

  // ======================================
  // TC7 – SPECIAL CHAR SLUG
  // ======================================
  test('should not allow special chars in slug', async ({ page }) => {

    await openCreateDrawer(page)
    await fillMandatory(page, '@@@@slug')

    await page.getByRole('button', { name: /create cms/i }).click()

    await expect(
      page.getByText('Enter a valid URL slug')
    ).toBeVisible()
  })

  // ======================================
  // TC8 – LONG SLUG
  // ======================================
  test('should not allow very long slug', async ({ page }) => {

    await openCreateDrawer(page)

    const longSlug = 'test-slug-'.repeat(30)

    await fillMandatory(page, longSlug)

    await page.getByRole('button', { name: /create cms/i }).click()

    await expect(
      page.getByText('Enter a valid URL slug')
    ).toBeVisible()
  })

  // ======================================
  // TC9 – CREATE INACTIVE CMS
  // ======================================
  test('should create CMS with inactive status', async ({ page }) => {

    const slug = 'test-slug-inactive'

    await openCreateDrawer(page)
    await fillMandatory(page, slug)

    await page.locator('[role="switch"]').click()

    await page.getByRole('button', { name: /create cms/i }).click()

    await page.waitForSelector('input[placeholder="Enter Slug"]', {
      state: 'detached'
    })

    const row = page.locator('tbody tr').filter({ hasText: slug })

    await expect(row).toBeVisible()
    await expect(row).toContainText(/inactive/i)
  })

})