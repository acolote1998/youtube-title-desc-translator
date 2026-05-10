# YouTube Title & Description Translator

Automates YouTube Studio video title and description translations using Playwright.

## What It Does

1. Loads saved cookies to authenticate the session
2. Opens a video's translation page on YouTube Studio
3. Reads pre-translated titles and descriptions from JSON files
4. Appends a fixed hashtag block to every description
5. Publishes each translation — one language at a time

English is always set as the base language first, then the script iterates through the remaining languages.

## Key Files

| File                                        | Purpose                                                 |
| ------------------------------------------- | ------------------------------------------------------- |
| `tests/youtube-translation.spec.ts`         | Main Playwright automation script                       |
| `utils/cookies/youtube-cookies.json`        | Cookies for youtube.com                                 |
| `utils/cookies/google-cookies.json`         | Cookies for google.com                                  |
| `utils/translations/translations{1-4}.json` | 4 translation files (split for LLM length limits)       |
| `utils/hashtags.ts`                         | Fixed hashtag string appended to all descriptions       |
| `utils/promptForTranslations.txt`           | Reusable prompt for an LLM to generate the translations |

## How Cookies Work

The script uses saved cookies to skip manual login. You need to export cookies yourself.

1. Install the [EditThisCookie](https://chromewebstore.google.com/detail/editthiscookie-v2/dbknbjeeaaicdjkgidnnbihckajabjbg) Chrome extension
2. Export cookies as JSON from **both** domains:
   - `youtube.com`
   - `google.com`
3. Save them to:
   - `utils/cookies/youtube-cookies.json`
   - `utils/cookies/google-cookies.json`

Example cookie files are provided at `utils/cookies/*.example.json`.

## Input JSON Format

Each entry in the translation JSON files must match this structure:

```json
[
  {
    "languageInYoutube": "",
    "translatedTitle": "",
    "translatedDescription": ""
  }
]
```

- `languageInYoutube` — must match the language name as it appears in YouTube Studio (e.g. `"Inglés"`, `"Alemán"`, `"Español"`, `"Hindi"`, `"Indonesio"`)
- `translatedTitle` — the translated video title
- `translatedDescription` — the translated video description (hashtags are appended automatically)

Translations are split across 4 files so you can send them to an LLM in separate prompts (free tiers have output length limits).

A ready-to-use prompt is included at `utils/promptForTranslations.txt` — feed it to any LLM along with your original title and description.

## Configuration Notes

- The repo is configured for YouTube Studio in **Spanish**. Locator text (button names, labels) matches the Spanish interface.
- The author's YouTube content is in English, but the browser locale is set to `es-ES`.
- If your YouTube Studio uses a different language, you may need to update locator strings in the Playwright script (e.g. `"Añadir idioma"`, `"Publicar"`, `"Guardar"`).
- The script runs with `headless: false` so you can watch the automation.

## Usage

1. Export cookies from youtube.com and google.com using EditThisCookie
2. Place them in `utils/cookies/`
3. Prepare translations in `utils/translations/translations{1-4}.json`
4. Update `videoLink` in the test file to your target video
5.

```bash
npm install
npx playwright install chromium
```

```bash
npm run test
```
