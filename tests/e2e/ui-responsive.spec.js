import { expect, test } from '@playwright/test'

const mobileViewport = { width: 390, height: 844 }

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

async function mockTncAnalysis(page) {
  await page.route('**/api/tnc-simplify', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        overallRisk: 'high',
        summary: 'The terms include important privacy and cancellation risks that should be reviewed on mobile.',
        flaggedClauses: [
          {
            category: 'Long data retention clause',
            severity: 'danger',
            clause: 'This clause explains that account information, uploaded documents, usage history, billing records, device information, support messages, and analytics data may be retained for a long period after the account is closed so the service can meet legal, operational, and security obligations.',
            consequence: 'Your information may remain stored after you stop using the service.',
            realCase: null,
          },
        ],
      }),
    })
  })
}

async function expectNoHorizontalOverflow(page) {
  const overflow = await page.evaluate(() => {
    const width = document.documentElement.clientWidth
    return document.documentElement.scrollWidth > width + 1
  })

  expect(overflow).toBe(false)
}

test.describe('UI and responsive testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(mobileViewport)
  })

  test('Scam Quiz page works on mobile without horizontal overflow', async ({ page }) => {
    await unlock(page)
    await page.goto('/scam-quiz')

    await expect(page.getByRole('heading', { name: 'Scam Quiz' })).toBeVisible()
    await expect(page.getByText('Question 1 of 5')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Knowledge Tips' })).toBeVisible()

    await page.locator('button').filter({ hasText: /^[A-C]\./ }).first().click()
    await expect(page.getByText(/Correct answer|Incorrect answer/)).toBeVisible()
    await expect(page.getByRole('button', { name: /Next Question/i })).toBeVisible()
    await expectNoHorizontalOverflow(page)
  })

  test('Awareness page works on mobile with mocked statistics', async ({ page }) => {
    await mockScamStats(page)
    await unlock(page)
    await page.goto('/awareness')

    await expect(page.getByRole('heading', { name: 'Scam Awareness' })).toBeVisible()
    await expect(page.getByText('80', { exact: true })).toBeVisible()
    await expect(page.getByText('$240,000')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Common scam types', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Trusted Australian help and information' })).toBeVisible()
    await expectNoHorizontalOverflow(page)
  })

  test('T&C Simplifier page works on mobile and long clauses remain visible', async ({ page }) => {
    await mockTncAnalysis(page)
    await unlock(page)
    await page.goto('/tnc-simplifier')

    await expect(page.getByRole('heading', { name: 'T&C Simplifier' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Website URL', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Paste Text', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Upload PDF', exact: true })).toBeVisible()

    await page.getByRole('button', { name: 'Paste Text', exact: true }).click()
    await page.getByPlaceholder('Paste the full Terms & Conditions text here...').fill('These terms contain enough words to analyse because the mobile responsive test is checking layout, wrapping, and result visibility after a mocked API response returns a deliberately long clause for display.')
    await page.getByRole('button', { name: /Analyse these T&Cs/i }).click()

    await expect(page.getByText('High Risk', { exact: true })).toBeVisible()
    await expect(page.getByText('Long data retention clause', { exact: true })).toBeVisible()
    await expect(page.getByText(/account information, uploaded documents, usage history/i)).toBeVisible()
    await expectNoHorizontalOverflow(page)
  })
})
