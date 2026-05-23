# YouTube Title, Description & Hashtag Automation

> Automates YouTube Studio translations, description updates, and hashtag reshuffling using Playwright.

---

## 🚀 What It Does

This project automates two Playwright workflows in YouTube Studio:

- `TRANSLATION` → publishes translated titles and descriptions for a configured video
- `HASHTAG_SHUFFLE` → refreshes hashtags across configured video translations while preserving existing content

### 🔧 Processing Modes

#### `TRANSLATION`

- loads saved YouTube and Google cookies
- opens a specific video translation editor using the hardcoded `videoLink` in `tests/youtube-helper.spec.ts`
- merges translation data from `utils/translations/translations1.json` through `translations6.json`
- appends a fixed hashtag block from `utils/hashtags.ts` to every translated description
- updates English first when `translateEnglishLanguage` is enabled
- publishes remaining languages through YouTube Studio
- validates that every language in `utils/languages.ts` is present in the translation dataset

#### `HASHTAG_SHUFFLE`

- loads saved YouTube and Google cookies
- sorts `utils/videoData.ts` by `releaseDate`
- skips videos that are not yet released or have invalid date formats
- builds a shuffled hashtag string from `utils/hashtags.ts`
- preserves the original translated text while only rewriting the hashtag block

---

## 📁 Key Files

- `tests/youtube-helper.spec.ts` — Playwright automation script and mode selection
- `utils/cookies/youtube-cookies.json` — YouTube authentication cookies
- `utils/cookies/google-cookies.json` — Google authentication cookies
- `utils/translations/translations{1-6}.json` — translation datasets merged at runtime
- `utils/hashtags.ts` — hashtag list used in both modes
- `utils/videoData.ts` — video list and release dates for hashtag shuffle mode
- `utils/languages.ts` — language list expected by the script
- `utils/promptForTranslations.txt` — translation prompt template

---

## 🔐 Cookie Setup

The script uses pre-exported cookies to bypass login.

1. Install the `EditThisCookie` Chrome extension
2. Export cookies from:
   - `youtube.com`
   - `google.com`
3. Save them as:
   - `utils/cookies/youtube-cookies.json`
   - `utils/cookies/google-cookies.json`

Example files are included in `utils/cookies/*.example.json`.

---

## 🧾 Translation JSON Format

Each translation entry must follow this structure:

```json
[
  {
    "languageInYoutube": "",
    "translatedTitle": "",
    "translatedDescription": ""
  }
]
```

- `languageInYoutube` must match the YouTube Studio language label used in the Spanish UI (for example, `Inglés`, `Alemán`)
- `translatedTitle` is the translated title string
- `translatedDescription` is the translated description string

The script merges the six translation files automatically. All languages listed in `utils/languages.ts` must appear in the merged data or translation mode will fail.

> Hashtags are handled automatically in both modes.

---

## 🏷️ Hashtag Behavior

### `TRANSLATION`

- uses the fixed hashtag list from `utils/hashtags.ts`
- appends the hashtag block to every translated description

### `HASHTAG_SHUFFLE`

- shuffles the hashtag list every run
- rebuilds the hashtag block dynamically
- strips existing hashtags from the description before applying the new set
- preserves translated content and only rewrites hashtags

---

## ⚙️ Configuration Notes

- Designed for Spanish YouTube Studio UI
- Uses Spanish UI labels like `Añadir idioma`, `Guardar`, `Publicar`
- Runs in `headless: false` for visibility and debugging
- `TRANSLATION` mode uses a hardcoded `videoLink` inside `tests/youtube-helper.spec.ts`
- `HASHTAG_SHUFFLE` mode uses `utils/videoData.ts` and requires valid `DD/MM/YYYY` release dates
- Set `PROCESSING_MODE` in `tests/youtube-helper.spec.ts`

---

## ▶️ How to Use

This project runs a Playwright automation that publishes YouTube Studio translations and/or reshuffles hashtags across videos.

### 1. Install dependencies

```
npm install
npx playwright install chromium
```

---

### 2. Configure processing mode

Open:

`tests/youtube-helper.spec.ts`

Set the mode:

`let PROCESSING_MODE: ProcessingType = 'TRANSLATION'  `

// or

`let PROCESSING_MODE: ProcessingType = 'HASHTAG_SHUFFLE'`

---

### 3. Add cookies (required)

Export cookies using a browser extension like EditThisCookie, then save:

`utils/cookies/youtube-cookies.json  `

`utils/cookies/google-cookies.json`

---

### 4. Configure required data

#### Translation mode requires:

- `utils/translations/translations1.json → translations6.json`
- `utils/languages.ts` (must include all expected languages)
- `utils/hashtags.ts`
- cookies:
  - `utils/cookies/youtube-cookies.json`
  - `utils/cookies/google-cookies.json`

#### Hashtag shuffle mode requires:

- `utils/videoData.ts` (video list + valid DD/MM/YYYY release dates)
- `utils/languages.ts` (must include all expected languages)
- `utils/hashtags.ts`
- cookies:
  - `utils/cookies/youtube-cookies.json`
  - `utils/cookies/google-cookies.json`

---

### 5. Run the automation

`npm run test`

---

## 🔁 Modes Overview

### TRANSLATION mode

- Opens YouTube Studio video translations page
- Publishes missing translations from JSON files
- Optionally updates English first
- Appends hashtags to every description
- Validates all languages from utils/languages.ts

---

### HASHTAG_SHUFFLE mode

- Loads videos from utils/videoData.ts
- Skips unreleased or invalid-date videos
- Shuffles hashtags per run
- Updates only hashtag section (preserves translated text)
- Publishes updated descriptions per language

---

## ⚠️ Notes

- Runs in headless: false (visible browser)
- Uses Spanish YouTube Studio UI (Añadir idioma, Publicar, etc.)
- Video target for TRANSLATION mode is hardcoded in the script
- Ensure cookies are valid or login will fail

---

## ✅ Summary

This repository automates YouTube Studio translation publishing and hashtag reshuffling.

- `TRANSLATION` publishes translated titles and descriptions with a fixed hashtag block
- `HASHTAG_SHUFFLE` refreshes hashtag order across configured videos while preserving existing translated content
