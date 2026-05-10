import { test, chromium } from '@playwright/test';
import fs from "fs";
import path from 'path';
import { hashtags } from '../utils/hashtags';
import { cargarTraducciones, cleanCookies, goToTranslations, log, pressTab } from '../utils/utils'

const translateEnglishLanguage: boolean = true

const videoLink =
  "https://studio.youtube.com/video/3J3aJFc81Zw/edit";

test('Publish missing YouTube Studio translations', async () => {

  const videoId = videoLink.split("/")[4];

  log(`🎬 Video ID: ${videoId}`);

  let traducciones = await cargarTraducciones();

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  log("🍪 Cargando cookies...");

  const youtubeCookies = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), "utils", "cookies", "youtube-cookies.json"),
      'utf-8'
    )
  );

  const googleCookies = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), "utils", "cookies", "google-cookies.json"),
      'utf-8'
    )
  );

  await context.addCookies(
    cleanCookies([...youtubeCookies, ...googleCookies])
  );

  log("🌐 Abriendo YouTube Studio...");

  await goToTranslations(page, videoId);

  await page.waitForTimeout(6000);

  if (!translateEnglishLanguage) {
    traducciones = traducciones.filter((traduccion) => { return traduccion.languageInYoutube !== "Inglés" })
  }
  else {

    const english = traducciones.find(
      t => t.languageInYoutube === "Inglés"
    );

    if (english) {

      await page.waitForTimeout(3000);

      log("✏️ Editando título y descripción en inglés...");

      await pressTab(page, 26)
      await page.keyboard.press("Enter");

      await page
        .getByRole("textbox", {
          name: "Añade un título que describa",
        })
        .fill(english.translatedTitle);

      await page
        .getByRole("textbox", {
          name: "Cuenta a los usuarios de qué",
        })
        .fill(english.translatedDescription + hashtags);

      await page
        .getByRole("button", { name: "Guardar" })
        .click({ timeout: 5000 });

      log("💾 Guardado idioma inglés");

      await page.waitForTimeout(7000);
    }
  }
  for (const translation of traducciones) {
    try {

      if (translation.languageInYoutube === "Inglés") {
        continue;
      }

      log(`🌍 Procesando idioma: ${translation.languageInYoutube}`);

      const languageExists = await page
        .locator('div.language-text')
        .filter({ hasText: translation.languageInYoutube })
        .first()
        .isVisible()
        .catch(() => false)

      if (languageExists) {
        log(`❌ ${translation.languageInYoutube} already translated, skipping...`);
        continue
      }

      await goToTranslations(page, videoId);

      await page
        .getByRole("menuitem", { name: "Subtítulos" })
        .click({ timeout: 5000 });

      await page
        .getByRole("button", { name: "Añadir idioma" })
        .click({ timeout: 5000 });

      await page.keyboard.type(translation.languageInYoutube[0])
      await page.keyboard.type(translation.languageInYoutube[1])
      await page.keyboard.type(translation.languageInYoutube[2])
      await page.keyboard.type(translation.languageInYoutube[3])
      await page.keyboard.press("Enter");

      const languageRow = page
        .locator("tr#row-container")
        .filter({ hasText: translation.languageInYoutube });

      await languageRow
        .locator("#cell-container").first()
        .focus();

      await page.waitForTimeout(1000);
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Enter");

      log(`📝 Escribiendo traducción: ${translation.languageInYoutube}`);

      await page
        .getByRole("textbox", { name: "Título*" })
        .fill(translation.translatedTitle, { timeout: 5000 });

      await page
        .locator("#translated-description")
        .getByRole("textbox", { name: "Descripción" })
        .fill((translation.translatedDescription + hashtags), { timeout: 5000 });

      await page
        .getByRole("button", { name: "Publicar" })
        .click({ timeout: 5000 });

      await page.waitForTimeout(7000);

      log(`✅ Publicado: ${translation.languageInYoutube}`);
    } catch (error) {
      log(`❌ Failed: ${translation.languageInYoutube}`);
      console.error(error);
    }
  }

  await browser.close();

  log("🏁 Test finalizado");
});