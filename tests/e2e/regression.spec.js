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

test.describe('Regression testing', () => {
  test('Scam Quiz can be completed and reset with Try Again', async ({ page }) => {
    await unlock(page)
    await page.goto('/scam-quiz')

    for (let questionNumber = 1; questionNumber <= 5; questionNumber += 1) {
      await expect(page.getByText(`Question ${questionNumber} of 5`)).toBeVisible()
      await page.locator('button').filter({ hasText: /^[A-C]\./ }).first().click()
      await page.getByRole('button', { name: questionNumber === 5 ? /See my score/i : /Next Question/i }).click()
    }

    await expect(page.getByText('Final score')).toBeVisible()
    await page.getByRole('button', { name: /Try Again/i }).click()
    await expect(page.getByText('Question 1 of 5')).toBeVisible()
    await expect(page.getByText('Final score')).toHaveCount(0)
  })

  test('T&C Simplifier mode switching changes the visible input UI', async ({ page }) => {
    await unlock(page)
    await page.goto('/tnc-simplifier')

    await expect(page.getByText('Link to the Terms & Conditions page')).toBeVisible()
    await expect(page.getByPlaceholder('https://example.com/terms')).toBeVisible()

    await page.getByRole('button', { name: 'Paste Text', exact: true }).click()
    await expect(page.getByText('Paste the Terms & Conditions here')).toBeVisible()
    await expect(page.getByPlaceholder('Paste the full Terms & Conditions text here...')).toBeVisible()

    await page.getByRole('button', { name: 'Upload PDF', exact: true }).click()
    await expect(page.getByText('Upload a PDF or text file')).toBeVisible()
    await expect(page.getByText('No file selected')).toBeVisible()
  })

  test('T&C Simplifier clears a selected valid text file after removal', async ({ page }) => {
    await unlock(page)
    await page.goto('/tnc-simplifier')

    await page.getByRole('button', { name: 'Upload PDF', exact: true }).click()
    await page.locator('#tnc-file-upload').setInputFiles({
      name: 'terms.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('These are valid fake terms and conditions for a frontend file selection regression test.'),
    })

    await expect(page.getByText('Selected file: terms.txt')).toBeVisible()
    await page.getByRole('button', { name: 'Remove file' }).click()
    await expect(page.getByText('No file selected')).toBeVisible()
    await expect(page.getByText('Selected file: terms.txt')).toHaveCount(0)
  })

  test('Awareness statistics still display after page reload', async ({ page }) => {
    await mockScamStats(page)
    await unlock(page)
    await page.goto('/awareness')

    await expect(page.getByText('80', { exact: true })).toBeVisible()
    await page.reload()
    await expect(page.getByRole('heading', { name: 'Scam Awareness' })).toBeVisible()
    await expect(page.getByText('80', { exact: true })).toBeVisible()
    await expect(page.getByText('$240,000')).toBeVisible()
  })
})
