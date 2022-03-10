type CodeceptJS_I = CodeceptJS.SupportObject['I'] & (CodeceptJS.Playwright | CodeceptJS.WebDriver)

export default {
  email: 'input#Email',
  password: 'input#Password',
  submit: 'input[type="submit"]',
  fillLoginForm(I: CodeceptJS_I, opts: { email: string; password: string }) {
    I.fillField(this.email, opts.email)
    I.fillField(this.password, opts.password)
    const retrySubject = I.retry(3)
    if (retrySubject.usePlaywrightTo) {
      retrySubject.usePlaywrightTo('login slowly', async ({ page }: { page: import('playwright').Page }) => {
        await page.click(this.submit, {
          timeout: 60000,
        })
      })
    } else {
      retrySubject.click(this.submit)
    }
  },
}
