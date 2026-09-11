export default async function capture(page) {
  await page.screenshot({ path: "docs/screenshots/login.png", fullPage: true });
  await page.getByLabel("E-mail institucional").fill("servidor@ssp.ba.gov.br");
  await page.getByLabel("Senha").fill("senha-de-teste");
  await page.getByRole("button", { name: "Acessar ambiente" }).click();
  await page.getByText("CICOMs cadastrados").waitFor();
  await page.screenshot({ path: "docs/screenshots/dashboard.png", fullPage: true });
  return { login: true, dashboard: true };
}
