import { expect, test } from '@playwright/test'

async function unlock(page) {
  await page.goto('/')
  await page.evaluate(() => {
    sessionStorage.setItem('safecheck-unlocked', 'true')
  })
}

async function mockScamStats(page) {
  await page.route('**/api/scam-stats/online-seniors', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        topScamTypes: [
          { scam_type: 'Investment scams', total_reports: 50, total_lost: 200000 },
          { scam_type: 'Phishing', total_reports: 30, total_lost: 40000 },
        ],
        summary: {
          total_reports: 80,
          total_lost: 240000,
        },
      }),
    })
  })
}

async function mockTncRateLimit(page) {
  await page.route('**/api/tnc-simplify', async (route) => {
    await route.fulfill({
      status: 429,
      headers: { 'retry-after': '15' },
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Rate limit reached. Wait a moment and retry.' }),
    })
  })
}

test.describe('Usability testing', () => {
  test('header navigation links are visible and usable', async ({ page }) => {
    await mockScamStats(page)
    await unlock(page)
    await page.goto('/')

    const navigation = page.getByRole('navigation')
    await expect(navigation.getByRole('link', { name: /SafeCheck/i })).toBeVisible()
    await expect(navigation.getByRole('link', { name: 'Home', exact: true })).toBeVisible()
    await expect(navigation.getByRole('link', { name: 'URL Verifier', exact: true })).toBeVisible()
    await expect(navigation.getByRole('link', { name: 'T&C Simplifier', exact: true })).toBeVisible()
    await expect(navigation.getByRole('link', { name: 'Scam Quiz', exact: true })).toBeVisible()
    await expect(navigation.getByRole('link', { name: 'Awareness', exact: true })).toBeVisible()

    await navigation.getByRole('link', { name: 'Awareness', exact: true }).click()
    await expect(page).toHaveURL(/awareness/)
    await expect(page.getByRole('heading', { name: 'Scam Awareness' })).toBeVisible()
  })

  test('T&C Simplifier explains results are educational guidance', async ({ page }) => {
    await page.route('**/api/tnc-simplify', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          overallRisk: 'low',
          summary: 'The terms are mostly straightforward in this mocked response.',
          flaggedClauses: [],
        }),
      })
    })
    await unlock(page)
    await page.goto('/tnc-simplifier')

    await page.getByRole('button', { name: 'Paste Text', exact: true }).click()
    await page.getByPlaceholder('Paste the full Terms & Conditions text here...').fill('These terms contain enough plain words for the usability test to submit a mocked analysis and confirm the guidance note is shown clearly to users.')
    await page.getByRole('button', { name: /Analyse these T&Cs/i }).click()

    await expect(page.getByText(/Educational guidance only/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /Analyse these T&Cs/i })).toBeVisible()
  })

  test('Scam Quiz presents guidance and clear action labels', async ({ page }) => {
    await unlock(page)
    await page.goto('/scam-quiz')

    await expect(page.getByRole('heading', { name: 'Knowledge Tips' })).toBeVisible()
    await page.locator('button').filter({ hasText: /^[A-C]\./ }).first().click()
    await expect(page.getByRole('button', { name: /Next Question/i })).toBeVisible()
  })

  test('T&C Simplifier error message is user-friendly', async ({ page }) => {
    await mockTncRateLimit(page)
    await unlock(page)
    await page.goto('/tnc-simplifier')

    await page.getByRole('button', { name: 'Paste Text', exact: true }).click()
    await page.getByPlaceholder('Paste the full Terms & Conditions text here...').fill('These terms contain enough plain words for the usability test to trigger a mocked friendly rate limit error message for the user.')
    await page.getByRole('button', { name: /Analyse these T&Cs/i }).click()

    await expect(page.getByText('Analysis failed', { exact: true })).toBeVisible()
    await expect(page.getByText(/Please wait about 15 seconds/i)).toBeVisible()
  })

  test('Awareness page support links are visible', async ({ page }) => {
    await mockScamStats(page)
    await unlock(page)
    await page.goto('/awareness')

    await expect(page.getByRole('heading', { name: 'Trusted Australian help and information' })).toBeVisible()
    await expect(page.getByRole('link', { name: /Scamwatch/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /ACCC Scams/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /cyber\.gov\.au/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /IDCARE/i })).toBeVisible()
  })
})
