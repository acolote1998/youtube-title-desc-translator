import { test, chromium, expect } from '@playwright/test';
import fs from "fs";
import path from 'path';
import { hashtagsArray } from '../utils/hashtags';
import { cargarTraducciones, cleanCookies, goToTranslations, log, pressTab, shuffleArray } from '../utils/utils'

let PROCESSING_MODE: "TRANSLATION" | "HASHTAG_SHUFFLE" = 'HASHTAG_SHUFFLE'

if (PROCESSING_MODE === 'TRANSLATION') {
  test('Publish missing YouTube Studio translations', async () => {

    const translateEnglishLanguage: boolean = true

    const videoLink =
      "https://studio.youtube.com/video/3J3aJFc81Zw/edit";

    const videoId = videoLink.split("/")[4];

    log(`🎬 Video ID: ${videoId}`);

    let baseHashtags = [...hashtagsArray]

    let hashtagsString = '\n \n '

    for (const hashtag of baseHashtags) {
      hashtagsString += hashtag
    }

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
          .fill(english.translatedDescription + hashtagsString);

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
          .fill((translation.translatedDescription + hashtagsString), { timeout: 5000 });

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
}

if (PROCESSING_MODE === 'HASHTAG_SHUFFLE') {
  test('Shuffle hashtags', async () => {

    const videoLinks = ['https://studio.youtube.com/video/30b8Vidu8U0/edit']

    let baseHashtags = [...hashtagsArray]

    if (videoLinks.length === 0 || !videoLinks[0]) { throw new Error("No videos found!") }

    for (const videoLink of videoLinks) {

      let shuffledHashtags = shuffleArray(baseHashtags)

      let hashtagsString = '\n \n '

      for (const hashtag of shuffledHashtags) {
        hashtagsString += ("#" + hashtag + " ")
      }

      const videoId = videoLink.split("/")[4];

      log(`🎬 Starting hashtag shuffle run — Video ID: ${videoId}`);

      let traducciones = await cargarTraducciones();

      const browser = await chromium.launch({
        headless: false,
        channel: 'chrome',
      });

      const context = await browser.newContext();
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
      const page = await context.newPage();

      log("🍪 Loading authentication cookies...");

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

      log("🌐 Opening YouTube Studio translations...");

      await goToTranslations(page, videoId);

      await page.waitForTimeout(7000);

      for (const translation of traducciones) {
        try {
          if (translation.languageInYoutube === "Inglés") {
            log("✏️ Updating English description with shuffled hashtags...");

            const languageRow = page
              .locator("tr#row-container")
              .filter({ hasText: translation.languageInYoutube });

            await languageRow
              .locator("#cell-container").first()
              .focus();

            await page.waitForTimeout(1000);
            await page.keyboard.press("Tab");
            await page.keyboard.press("Tab");
            await page.keyboard.press("Enter");

            await page.waitForTimeout(3000);

            let descriptionBox = await page
              .getByRole("textbox", {
                name: "Cuenta a los usuarios de qué",
              })

            let descriptionWithoutHashtags = (await descriptionBox.innerText()).split('#')[0].trim();

            await descriptionBox
              .fill(descriptionWithoutHashtags + hashtagsString);

            await page
              .getByRole("button", { name: "Guardar" })
              .click({ timeout: 5000 });

            log("💾 English version saved");

            await page.waitForTimeout(7000);

            continue;
          }

          log(`🌍 Processing hashtags for language: ${translation.languageInYoutube}`);

          await goToTranslations(page, videoId);

          try {
            await expect(
              page.locator("tr#row-container").filter({ hasText: translation.languageInYoutube })
            ).toBeVisible();
          } catch {
            console.log(`⚠️ Missing translation row — Video: ${videoId} | Language: ${translation.languageInYoutube}`);
            continue;
          }

          const languageRow = page
            .locator("tr#row-container")
            .filter({ hasText: translation.languageInYoutube });

          await languageRow
            .locator("#cell-container").first()
            .focus();

          await page.waitForTimeout(1000);
          await page.keyboard.press("Tab");
          await page.keyboard.press("Tab");
          await page.keyboard.press("Enter");

          log(`📝 Opening editor — ${translation.languageInYoutube}`);

          await page.waitForTimeout(1000);

          await page
            .locator("#translated-description")
            .getByRole("textbox", { name: "Descripción" })
            .focus();
          await page.waitForTimeout(1000);

          await page.keyboard.down('Control')
          await page.keyboard.down('A')
          await page.waitForTimeout(1000);
          await page.keyboard.up('Control')
          await page.keyboard.up('A')
          await page.waitForTimeout(1000);
          await page.keyboard.down('Control')
          await page.keyboard.down('C')
          await page.waitForTimeout(1000);
          await page.keyboard.up('Control')
          await page.keyboard.up('C')
          await page.waitForTimeout(1000);

          const description = await page.evaluate(() => navigator.clipboard.readText());
          let descriptionWithoutHashtags = (await description).split('#')[0].replace(/\r\n/g, '\n')
            .replace(/\n{3,}/g, '\n\n')
            .split('#')[0]
            .trim();

          let finalDescription = descriptionWithoutHashtags + hashtagsString

          await page.keyboard.press('Backspace')
          await page.waitForTimeout(1000);
          await page.keyboard.type(finalDescription)

          await page
            .getByRole("button", { name: "Publicar" })
            .click({ timeout: 5000 });

          await page.waitForTimeout(7000);

          log(`✅ Successfully published updated hashtags — ${translation.languageInYoutube}`);

        } catch (error) {
          log(`❌ Failed: ${translation.languageInYoutube}`);
          console.error(error);
        }
      }

      await browser.close();

      log("🏁 Hashtag shuffle run completed");
    }
  });
}
