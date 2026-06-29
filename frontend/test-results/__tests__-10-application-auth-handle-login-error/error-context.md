# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: __tests__/10-application.test.js >> auth >> handle login error
- Location: __tests__/10-application.test.js:83:3

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('text=Неверные имя пользователя или пароль')
Expected: 1
Received: 0
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('text=Неверные имя пользователя или пароль')
    14 × locator resolved to 0 elements
       - unexpected value "0"

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - navigation [ref=e4]:
      - generic [ref=e5]:
        - link "Hexlet Chat" [ref=e6] [cursor=pointer]:
          - /url: /
        - button "Выйти" [ref=e7] [cursor=pointer]
    - generic [ref=e10]:
      - generic [ref=e12]:
        - generic [ref=e13]:
          - generic [ref=e14]: Каналы
          - button "+" [ref=e15] [cursor=pointer]:
            - img [ref=e16]
            - generic [ref=e19]: +
        - list [ref=e20]:
          - listitem [ref=e21]:
            - button "#general" [ref=e23] [cursor=pointer]
          - listitem [ref=e24]:
            - button "#random" [ref=e26] [cursor=pointer]
      - generic [ref=e28]:
        - generic [ref=e29]:
          - paragraph [ref=e30]: "# general"
          - text: 0 сообщений
        - generic [ref=e32]: Нет сообщений. Напишите первое!
        - generic [ref=e35]:
          - textbox "Новое сообщение" [ref=e36]:
            - /placeholder: Введите сообщение...
          - button "Отправить" [disabled]:
            - img
            - generic: Отправить
  - region "Notifications Alt+T"
```

# Test source

```ts
  1   | // @ts-check
  2   | 
  3   | import { expect, test } from '@playwright/test'
  4   | 
  5   | const registeredUser = {
  6   |   login: 'admin',
  7   |   password: 'admin',
  8   | }
  9   | 
  10  | const newUser = {
  11  |   login: 'user2',
  12  |   password: 'password',
  13  | }
  14  | 
  15  | test.beforeEach(async ({ page }) => {
  16  |   await page.goto('/')
  17  |   await page.waitForTimeout(300)
  18  | 
  19  |   await page.locator('text=Hexlet Chat').first().click()
  20  | })
  21  | 
  22  | test.describe('registration', () => {
  23  |   test('handle new user creation', async ({ page }) => {
  24  |     await page.locator('text=Регистрация').first().click()
  25  |     await page.waitForURL('**/signup')
  26  |     await page.locator('text=Имя пользователя').first().type(newUser.login)
  27  |     await page.locator('text=/^Пароль:?$/').first().type(newUser.password)
  28  |     await page.locator('text=Подтвердите пароль').first().type(newUser.password)
  29  |     await page.locator('button[type="submit"]').first().click()
  30  |     await page.waitForURL('**/')
  31  |     await expect(
  32  |       await page.getByRole('button', { name: 'general' }),
  33  |     ).not.toHaveCount(0)
  34  |   })
  35  | 
  36  |   test('no duplicated users created', async ({ page }) => {
  37  |     await page.locator('text=Регистрация').first().click()
  38  |     await page.waitForURL('**/signup')
  39  |     await page.locator('text=Имя пользователя').first().type(newUser.login)
  40  |     await page.locator('text=/^Пароль:?$/').first().type(newUser.password)
  41  |     await page.locator('text=Подтвердите пароль').first().type(newUser.password)
  42  |     await page.locator('button[type="submit"]').first().click()
  43  |     await expect(
  44  |       await page.locator('text=Такой пользователь уже существует'),
  45  |     ).not.toHaveCount(0)
  46  |   })
  47  | 
  48  |   test('handle validation', async ({ page }) => {
  49  |     await page.locator('text=Регистрация').first().click()
  50  |     await page.waitForURL('**/signup')
  51  | 
  52  |     await page.locator('text=Имя пользователя').first().type('u')
  53  |     await page.locator('text=/^Пароль:?$/').first().type('pass')
  54  |     await page.locator('text=Подтвердите пароль').first().type('passw')
  55  |     await page.locator('button[type="submit"]').first().click()
  56  |     await expect(await page.locator('text=От 3 до 20 символов')).toHaveCount(1)
  57  |     await expect(await page.locator('text=Не менее 6 символов')).toHaveCount(1)
  58  |     await expect(
  59  |       await page.locator('text=Пароли должны совпадать'),
  60  |     ).toHaveCount(1)
  61  |   })
  62  | })
  63  | 
  64  | test.describe('auth', () => {
  65  |   test('login page on enter as guest', async ({ page }) => {
  66  |     await expect(await page.locator('text=Ваш ник')).toHaveCount(1)
  67  |     await expect(await page.locator('text=/^Пароль:?$/')).toHaveCount(1)
  68  |   })
  69  | 
  70  |   test('successful login', async ({ page }) => {
  71  |     await page.locator('text=Ваш ник').first().type(registeredUser.login)
  72  |     await page
  73  |       .locator('text=/^Пароль:?$/')
  74  |       .first()
  75  |       .type(registeredUser.password)
  76  |     await page.locator('button[type="submit"]').first().click()
  77  | 
  78  |     await expect(
  79  |       await page.locator('text=Неверные имя пользователя или пароль'),
  80  |     ).toHaveCount(0)
  81  |   })
  82  | 
  83  |   test('handle login error', async ({ page }) => {
  84  |     await page.locator('text=Ваш ник').first().type('guest')
  85  |     await page.locator('text=/^Пароль:?$/').first().type('pass')
  86  |     await page.locator('button[type="submit"]').first().click()
  87  | 
  88  |     await expect(
  89  |       await page.locator('text=Неверные имя пользователя или пароль'),
> 90  |     ).toHaveCount(1)
      |       ^ Error: expect(locator).toHaveCount(expected) failed
  91  |   })
  92  | })
  93  | 
  94  | test.describe('chat', () => {
  95  |   test.beforeEach(async ({ page }) => {
  96  |     await page.locator('text=Ваш ник').first().type(registeredUser.login)
  97  |     await page
  98  |       .locator('text=/^Пароль:?$/')
  99  |       .first()
  100 |       .type(registeredUser.password)
  101 |     await page.locator('button[type="submit"]').first().click()
  102 |     await page.locator('[aria-label="Новое сообщение"]')
  103 |   })
  104 | 
  105 |   test('messaging', async ({ page }) => {
  106 |     await page.locator('[aria-label="Новое сообщение"]').first().type('hello')
  107 |     await page.keyboard.press('Enter')
  108 |     await expect(await page.locator('text=hello')).not.toHaveCount(0)
  109 |   })
  110 | 
  111 |   test('different channels', async ({ page }) => {
  112 |     await page
  113 |       .locator('[aria-label="Новое сообщение"]')
  114 |       .first()
  115 |       .type('message for general')
  116 |     await page.keyboard.press('Enter')
  117 |     await expect(
  118 |       await page.locator('text=message for general'),
  119 |     ).not.toHaveCount(0)
  120 |     await page.locator('text=random').first().click()
  121 |     await expect(await page.locator('text=message for general')).toHaveCount(0)
  122 |     await page
  123 |       .locator('[aria-label="Новое сообщение"]')
  124 |       .first()
  125 |       .type('message for random')
  126 |     await page.keyboard.press('Enter')
  127 |     await expect(await page.locator('text=message for random')).not.toHaveCount(
  128 |       0,
  129 |     )
  130 |   })
  131 | 
  132 |   test('adding channel', async ({ page }) => {
  133 |     await page.locator('text=+').first().click()
  134 |     await page.locator('text=Имя канала').first().type('test channel')
  135 |     await page.keyboard.press('Enter')
  136 | 
  137 |     await expect(await page.locator('text=Канал создан')).toBeVisible()
  138 |     await expect(await page.locator('text=test channel')).not.toHaveCount(0)
  139 |   })
  140 | 
  141 |   test('adding channel validation', async ({ page }) => {
  142 |     await page.locator('text=+').first().click()
  143 |     await page.getByLabel('Имя канала').first().type('test long channel name')
  144 |     await page.keyboard.press('Enter')
  145 | 
  146 |     await expect(await page.locator('text=От 3 до 20 символов')).toHaveCount(1)
  147 |   })
  148 | 
  149 |   test('adding channel profanity', async ({ page }) => {
  150 |     // проверка для имени канала
  151 |     await page.locator('text=+').first().click()
  152 |     await page.getByLabel('Имя канала').first().type('boobs')
  153 |     await page.keyboard.press('Enter')
  154 | 
  155 |     await expect(
  156 |       await page.getByRole('button', { name: '*****' }),
  157 |     ).not.toHaveCount(0)
  158 |   })
  159 | 
  160 |   test('rename channel', async ({ page }) => {
  161 |     await page.locator('text="Управление каналом"').first().click()
  162 |     await page.locator('text=Переименовать').first().click()
  163 |     const input = page.getByLabel('Имя канала')
  164 |     await input.fill('')
  165 |     await input.first().type('new test channel')
  166 |     await page.keyboard.press('Enter')
  167 | 
  168 |     await expect(await page.locator('text=Канал переименован')).toBeVisible()
  169 |     await expect(await page.locator('text=new test channel')).not.toHaveCount(0)
  170 |   })
  171 | 
  172 |   test('remove channel', async ({ page }) => {
  173 |     await page.locator('text=Управление каналом').first().click()
  174 |     await page.locator('text=Удалить').first().click()
  175 | 
  176 |     await page
  177 |       .getByRole('button', { name: 'Удалить' })
  178 |       .filter({ visible: true })
  179 |       .last()
  180 |       .click()
  181 | 
  182 |     await expect(await page.locator('text=Канал удалён')).toBeVisible()
  183 | 
  184 |     await page.waitForSelector('[data-testid="modal"]', { state: 'hidden' })
  185 | 
  186 |     await expect(await page.locator('text=# new test channel')).toHaveCount(0)
  187 |   })
  188 | })
  189 | 
  190 | test.describe('two users chatting', () => {
```