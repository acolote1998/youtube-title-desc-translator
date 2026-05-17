# YouTube Title, Description & Hashtag Automation

> Automates YouTube Studio translations and description updates using Playwright.

---

## 🚀 What It Does

This project supports two processing modes:

- `TRANSLATION` → publishes missing language translations (title + description)
- `HASHTAG_SHUFFLE` → regenerates and shuffles hashtags in existing descriptions on each run

### 🔧 Processing Modes

#### `TRANSLATION`

- Loads saved cookies and authenticates into YouTube Studio
- Opens a video’s translation editor
- Reads pre-generated translations from JSON files
- Appends a fixed hashtag block to each description
- Publishes translations for each missing language
- Optionally updates English first as the base language

#### `HASHTAG_SHUFFLE`

- Loads saved cookies and opens YouTube Studio translations
- Reads existing translations
- Loads configured video entries from `utils/videoData.ts` as objects containing `link`, `videoName`, and `releaseDate`
- Randomly shuffles the hashtag array each run
- Rebuilds the hashtag string dynamically
- Updates:
  - English description (save flow)
  - All other language descriptions (publish flow)
- Strips existing hashtags before applying the shuffled set
- Publishes updated descriptions per language

> This mode allows periodic hashtag refreshes while preserving the current translation content.

---

## 📁 Key Files

- `tests/youtube-helper.spec.ts` — Main Playwright automation script (both modes)
- `utils/cookies/youtube-cookies.json` — YouTube authentication cookies
- `utils/cookies/google-cookies.json` — Google authentication cookies
- `utils/translations/translations{1-6}.json` — Translation datasets (split for LLM limits)
- `utils/hashtags.ts` — Base hashtag array used for both fixed and shuffled modes
- `utils/promptForTranslations.txt` — Prompt template for generating translations

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

- `languageInYoutube` → must match the YouTube Studio language label (e.g. `Inglés`, `Alemán`)
- `translatedTitle` → translated title text
- `translatedDescription` → translated description text

> Hashtags are handled automatically in both modes.

---

## 🏷️ Hashtag Behavior

### `TRANSLATION`

- Uses the fixed hashtag list from `utils/hashtags.ts`
- Appends the unchanged hashtag block to all descriptions

### `HASHTAG_SHUFFLE`

- Creates a shuffled copy of the hashtag array per run using `shuffleArray(baseHashtags)`
- Rebuilds the hashtag string dynamically
- Ensures a different ordering every run
- Strips existing hashtags before applying the shuffled set

---

## ⚙️ Configuration Notes

- Designed for Spanish YouTube Studio UI
- Locators depend on Spanish labels like `Añadir idioma`, `Guardar`, `Publicar`
- Runs in `headless: false` for visibility and debugging
- English is treated as a special case in both modes
- Clipboard-based extraction is used for description rewriting in shuffle mode

---

## ▶️ Usage

1. Export cookies from YouTube + Google
2. Place them in `utils/cookies/`
3. Prepare translation JSON files
4. Configure the target video in `utils/videoData.ts` as an object with `link`, `videoName`, and `releaseDate`
5. Choose mode:

```ts
let PROCESSING_MODE: "TRANSLATION" | "HASHTAG_SHUFFLE";
```

### Install dependencies

```bash
npm install
npx playwright install chromium
```

### Run tests

```bash
npm run test
```

---

## ✅ Summary

This repository supports:

- Static translation publishing for missing languages
- Dynamic hashtag reshuffling and re-publication without changing translations

The `HASHTAG_SHUFFLE` mode rotates hashtags while preserving translation content and publishing flow.
