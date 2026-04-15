import { test, expect } from '@playwright/test'

test.describe('Landing page', () => {
  test('loads and shows both CTA cards', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('30-second')).toBeVisible()
    await expect(page.getByText('Set up a session')).toBeVisible()
    await expect(page.getByText('Enter session code')).toBeVisible()
  })

  test('teacher card links to /teacher', async ({ page }) => {
    await page.goto('/')
    await page.getByText('Set up a session').click()
    await expect(page).toHaveURL('/teacher')
  })

  test('student card links to /student', async ({ page }) => {
    await page.goto('/')
    await page.getByText('Enter session code').click()
    await expect(page).toHaveURL('/student')
  })
})

test.describe('Student code entry', () => {
  test('shows code entry form', async ({ page }) => {
    await page.goto('/student')
    await expect(page.getByPlaceholder('XXXX-0000')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Go' })).toBeVisible()
  })

  test('shows error for invalid code format', async ({ page }) => {
    await page.goto('/student')
    await page.getByPlaceholder('XXXX-0000').fill('INVALID')
    await page.getByRole('button', { name: 'Go' }).click()
    await expect(page.getByText('Enter a valid code')).toBeVisible()
  })

  test('formats code with hyphen as user types', async ({ page }) => {
    await page.goto('/student')
    const input = page.getByPlaceholder('XXXX-0000')
    await input.fill('ABCD1234')
    await expect(input).toHaveValue('ABCD-1234')
  })

  test('navigates to /student/[code] with valid code', async ({ page }) => {
    await page.goto('/student')
    await page.getByPlaceholder('XXXX-0000').fill('ABCD-1234')
    await page.getByRole('button', { name: 'Go' }).click()
    await expect(page).toHaveURL('/student/ABCD-1234')
  })

  test('Enter key submits the code', async ({ page }) => {
    await page.goto('/student')
    await page.getByPlaceholder('XXXX-0000').fill('ABCD-1234')
    await page.getByPlaceholder('XXXX-0000').press('Enter')
    await expect(page).toHaveURL('/student/ABCD-1234')
  })
})

test.describe('Student check-in page', () => {
  test('shows error for unknown session code', async ({ page }) => {
    await page.goto('/student/ZZZZ-0000')
    await expect(page.getByText('Session code not found')).toBeVisible({ timeout: 5000 })
  })

  test('shows back link', async ({ page }) => {
    await page.goto('/student/ZZZZ-0000')
    await expect(page.getByText('← Back')).toBeVisible()
  })

  test('back link returns to /student', async ({ page }) => {
    await page.goto('/student/ZZZZ-0000')
    await page.getByText('← Back').click()
    await expect(page).toHaveURL('/student')
  })
})

test.describe('Teacher auth page', () => {
  test('shows sign in form', async ({ page }) => {
    await page.goto('/teacher')
    await expect(page.getByText('Teacher sign in')).toBeVisible()
    await expect(page.getByPlaceholder('you@school.edu.au')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Send link' })).toBeVisible()
  })

  test('shows error for empty email', async ({ page }) => {
    await page.goto('/teacher')
    await page.getByRole('button', { name: 'Send link' }).click()
    await expect(page.getByText('Enter your email.', { exact: true })).toBeVisible()
  })
})
