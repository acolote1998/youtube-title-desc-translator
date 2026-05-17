import { YoutubeTranslation } from "../types/types";
import fs from "fs";
import path from 'path';

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function countdown(seconds: number, message = "Starting in") {
    for (let i = seconds; i > 0; i--) {
        process.stdout.write(`\r${message} ${i}s   `);
        await sleep(1000);
    }
    process.stdout.write(`\r${message} GO!        \n`);
}

export const parseReleaseDate = (dateString: string): Date => {
    const [day, month, year] = dateString.split('/')

    return new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
    )
}

export function shuffleArray(arr: Array<string>) {
    const a = [...arr]; // avoid mutating original

    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }

    return a;
}

export async function pressTab(page: any, times: number) {
    for (let i = 0; i < times; i++) {
        await page.keyboard.press("Tab");
    }
}
export async function goToTranslations(page: any, videoId: string) {
    await page.goto(
        `https://studio.youtube.com/video/${videoId}/translations`
    );

    await page.waitForSelector('div.language-text');
}

export const log = (msg: string) =>
    console.log(`\n🧪 ${msg}`);

export async function cargarTraducciones(): Promise<
    YoutubeTranslation[]
> {
    log("📂 Cargando traducciones JSON...");

    const filePath1 = path.join(process.cwd(), "utils", "translations", "translations1.json");
    const filePath2 = path.join(process.cwd(), "utils", "translations", "translations2.json");
    const filePath3 = path.join(process.cwd(), "utils", "translations", "translations3.json");
    const filePath4 = path.join(process.cwd(), "utils", "translations", "translations4.json");
    const filePath5 = path.join(process.cwd(), "utils", "translations", "translations5.json");
    const filePath6 = path.join(process.cwd(), "utils", "translations", "translations6.json");

    const fileContent1 = fs.readFileSync(filePath1, "utf-8");
    const fileContent2 = fs.readFileSync(filePath2, "utf-8");
    const fileContent3 = fs.readFileSync(filePath3, "utf-8");
    const fileContent4 = fs.readFileSync(filePath4, "utf-8");
    const fileContent5 = fs.readFileSync(filePath5, "utf-8");
    const fileContent6 = fs.readFileSync(filePath6, "utf-8");

    const data: YoutubeTranslation[] = [
        ...JSON.parse(fileContent1),
        ...JSON.parse(fileContent2),
        ...JSON.parse(fileContent3),
        ...JSON.parse(fileContent4),
        ...JSON.parse(fileContent5),
        ...JSON.parse(fileContent6),
    ];

    log(`✅ Traducciones cargadas: ${data.length}`);

    return data;
}

export function cleanCookies(cookies: any[]) {
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