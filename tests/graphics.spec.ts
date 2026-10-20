import { expect, test } from '@playwright/test'

test('proof panel states the finding and cites its sources', async ({ page }) => {
  await page.goto('/')

  const proof = page.locator('.proof')
  await expect(proof.getByRole('heading', { name: 'The first five minutes decide the lead' })).toBeVisible()
  await expect(proof.locator('#fn1').getByRole('link', { name: 'Lead Response Management Study' }))
    .toHaveAttribute('href', 'https://25649.fs1.hubspotusercontent-na2.net/hub/25649/file-13535879-pdf/docs/mit_study.pdf')
  await expect(proof.locator('#fn2')).toContainText('Estimate')
})

test('before/after measures are drawn and described', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('img', { name: /Before: 5 to 10 minutes\. After: under 60 seconds\./ })).toBeVisible()
  await expect(page.getByRole('img', { name: /Before: about 50 hours a month/ })).toBeVisible()
  const after = await page.locator('.band-after').boundingBox()
  const before = await page.locator('.band-before').boundingBox()
  expect(after!.width).toBeGreaterThan(0)
  expect(before!.width).toBeGreaterThan(after!.width)
})
