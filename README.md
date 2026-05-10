# YouTube Title and Description Translation Automation (Playwright)

This project automates YouTube Studio translations using Playwright.

It:

- Loads YouTube video translation page
- Uses saved cookies for authentication
- Reads translations from a JSON file
- Fills title and description for multiple languages
- Publishes each translation automatically

---

## Structure

tests/
youtube-cookies.json
google-cookies.json
translations.json
test file (Playwright script)

---

## Cookies

Cookies are extracted manually from youtube.com and google.com using the EditThisCookie Chrome extension.

They are saved as JSON files and loaded into the Playwright browser context.

---

## What the script does

- Opens YouTube Studio translation page for a video
- Logs in using cookies
- Sets English title and description first
- Loops through all other languages
- Fills translated title and description
- Appends hashtags to descriptions
- Publishes each translation

---

## Hashtags

A fixed hashtag block is appended to every description to improve reach and discoverability.

---

## Translation input

The script uses a JSON array with this structure:

[
{
"languageInYoutube": "",
"translatedTitle": "",
"translatedDescription": ""
}
]

---

## Rules

- Output JSON only for translations generation
- Do not translate hashtags
- Keep meaning and tone natural for YouTube Shorts
- Use \n when line breaks are needed
- Must include all required languages

---

## Supported languages

English, German, Spanish, Hindi, Indonesian, Swedish, Greek, Italian, Turkish, Dutch, Russian, Arabic, French

---

## Flow

1. Load cookies
2. Open YouTube Studio video translations page
3. Fill English version first
4. Loop all other languages
5. Fill title + description
6. Publish each one
