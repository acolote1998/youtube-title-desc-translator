import { test, chromium } from '@playwright/test';
import fs from "fs";
import path from 'path';

let hashtags = "\n \n #sourdoughstarter #recipe #sourdoughtok #breadtok #stepbystep #sourdoughbread #sourdoughstarter #bread #breadbaking #sourdoughrecipe #baking #sourdoughscoring #sourdoughtips #breadmaking #homebaker #povcooking #foodasmr #breadasmr #oddlysatisfying #fyp #foryou #surdeig #surdeigsbröd #pan #panmasamadre #masamadre #pandemasamadre #starter #feedingstarter #sourdoughstarter #Sauerteig #BrotBacken #Hausgemacht #RotiSourdough #MasakDiRumah #ResepRoti #Surdegsbröd #BakaHemma #BrödBakning #khamir #roti #khamirroti #ghar #par #baking #gharpar #gharparbaking #olives #aceitunas #Oliven #Zaitun #Oliver #zaitoon"

const videoLink =
  "https://studio.youtube.com/video/3J3aJFc81Zw/edit";

const videoId = videoLink.split("/")[4];

type TraduccionYoutube = {
  idiomaEnYoutube:
  string
  tituloTraducido: string;
  descriptionTraducida: string;
};

const log = (msg: string) =>
  console.log(`\n🧪 ${msg}`);

async function cargarTraducciones(): Promise<
  TraduccionYoutube[]
> {
  log("📂 Cargando traducciones JSON...");

  const filePath1 = path.join(process.cwd(), "tests", "translations1.json");
  const filePath2 = path.join(process.cwd(), "tests", "translations2.json");
  const filePath3 = path.join(process.cwd(), "tests", "translations3.json");
  const filePath4 = path.join(process.cwd(), "tests", "translations4.json");

  const fileContent1 = fs.readFileSync(filePath1, "utf-8");
  const fileContent2 = fs.readFileSync(filePath2, "utf-8");
  const fileContent3 = fs.readFileSync(filePath3, "utf-8");
  const fileContent4 = fs.readFileSync(filePath4, "utf-8");

  const data: TraduccionYoutube[] = [
    ...JSON.parse(fileContent1),
    ...JSON.parse(fileContent2),
    ...JSON.parse(fileContent3),
    ...JSON.parse(fileContent4),
  ];

  log(`✅ Traducciones cargadas: ${data.length}`);

  return data;
}

function cleanCookies(cookies: any[]) {
  return cookies.map(c => {
    const cleaned: any = {
      name: c.name,
      value: c.value,
      domain: c.domain,
      path: c.path || '/',
      secure: c.secure,
      httpOnly: c.httpOnly,
    };

    if (c.sameSite === 'no_restriction') cleaned.sameSite = 'None';
    else if (c.sameSite === 'lax') cleaned.sameSite = 'Lax';
    else if (c.sameSite === 'strict') cleaned.sameSite = 'Strict';

    if (c.expirationDate) {
      cleaned.expires = c.expirationDate;
    }

    return cleaned;
  });
}

test('YouTube with cleaned cookies', async () => {


  log(`🎬 Video ID: ${videoId}`);

  const traducciones = await cargarTraducciones();

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  const testDir = __dirname;

  log("🍪 Cargando cookies...");

  const youtubeCookies = JSON.parse(
    fs.readFileSync(
      path.join(testDir, 'youtube-cookies.json'),
      'utf-8'
    )
  );

  const googleCookies = JSON.parse(
    fs.readFileSync(
      path.join(testDir, 'google-cookies.json'),
      'utf-8'
    )
  );

  await context.addCookies(
    cleanCookies([...youtubeCookies, ...googleCookies])
  );

  log("🌐 Abriendo YouTube Studio...");

  await page.goto(
    `https://studio.youtube.com/video/${videoId}/translations`
  );

  const english = traducciones.find(
    t => t.idiomaEnYoutube === "Inglés"
  );

  if (!english) {
    throw new Error("No English translation found");
  }

  await page.waitForTimeout(3000);

  log("✏️ Editando título y descripción en inglés...");

  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");

  await page
    .getByRole("textbox", {
      name: "Añade un título que describa",
    })
    .fill(english.tituloTraducido);

  await page
    .getByRole("textbox", {
      name: "Cuenta a los usuarios de qué",
    })
    .fill(english.descriptionTraducida + hashtags);

  await page
    .getByRole("button", { name: "Guardar" })
    .click({ timeout: 5000 });

  log("💾 Guardado idioma inglés");

  await page.waitForTimeout(7000);

  for (const translation of traducciones) {
    if (
      translation.idiomaEnYoutube === "Inglés" ||
      translation.idiomaEnYoutube === "Alemán" ||
      translation.idiomaEnYoutube === "Español" ||
      translation.idiomaEnYoutube === "Francés" ||
      translation.idiomaEnYoutube === "Griego" ||
      translation.idiomaEnYoutube === "Hindi" ||
      translation.idiomaEnYoutube === "Indonesio" ||
      translation.idiomaEnYoutube === "Inglés (idioma del vídeo)" ||
      translation.idiomaEnYoutube === "Italiano" ||
      translation.idiomaEnYoutube === "Neerlandés" ||
      translation.idiomaEnYoutube === "Ruso" ||
      translation.idiomaEnYoutube === "Sueco" ||
      translation.idiomaEnYoutube === "Turco" ||
      translation.idiomaEnYoutube === "Árabe"
    ) continue;

    log(`🌍 Procesando idioma: ${translation.idiomaEnYoutube}`);

    await page.goto(
      `https://studio.youtube.com/video/${videoId}/translations`
    );

    await page
      .getByRole("menuitem", { name: "Subtítulos" })
      .click({ timeout: 5000 });

    await page
      .getByRole("button", { name: "Añadir idioma" })
      .click({ timeout: 5000 });

    await page.keyboard.type(translation.idiomaEnYoutube[0])
    await page.keyboard.type(translation.idiomaEnYoutube[1])
    await page.keyboard.type(translation.idiomaEnYoutube[2])
    await page.keyboard.type(translation.idiomaEnYoutube[3])
    await page.keyboard.press("Enter");

    const languageRow = page
      .locator("tr#row-container")
      .filter({ hasText: translation.idiomaEnYoutube });

    await languageRow
      .locator("#cell-container").first()
      .focus();

    await page.waitForTimeout(1000);
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");

    log(`📝 Escribiendo traducción: ${translation.idiomaEnYoutube}`);

    await page
      .getByRole("textbox", { name: "Título*" })
      .fill(translation.tituloTraducido, { timeout: 5000 });

    await page
      .locator("#translated-description")
      .getByRole("textbox", { name: "Descripción" })
      .fill((translation.descriptionTraducida + hashtags), { timeout: 5000 });

    await page
      .getByRole("button", { name: "Publicar" })
      .click({ timeout: 5000 });

    await page.waitForTimeout(7000);

    log(`✅ Publicado: ${translation.idiomaEnYoutube}`);
  }

  await browser.close();

  log("🏁 Test finalizado");
});