export async function typeWithDelay(locator, value, delay = 200) {
  await locator.click({ force: true });

  await locator.press("Control+A");
  await locator.press("Backspace");

  for (const char of value) {
    await locator.type(char, { delay });
  }
}