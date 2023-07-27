import puppeteer from "puppeteer-extra";
import pluginStealth from "puppeteer-extra-plugin-stealth";
import request from "request-promise-native";
import { MetascraperData, tryMetascraper } from "./metascrape.js";
import { HttpsError } from "firebase-functions/v2/https";
import { getTitle } from "./getTitle.js";
import { getImg } from "./getImg.js";
import { getFavicon } from "./getFavicon.js";
import { getDomainName } from "./getDomainName.js";
import { getDescription } from "./getDescription.js";
import { getCanonicalUrl } from "./getCanonicalUrl.js";
import { Page, PuppeteerLaunchOptions } from "puppeteer";
import { urlImageIsAccessible } from "./urlImageIsAccessible.js";

export type PageInfo = {
  title?: string | null;
  description?: string | null;
  domain?: string | null;
  img?: string | null;
  favicon?: string | null;
  canonicalUrl?: string | null;
  clearbit?: string | null;
};

/**
 * Scrapes page information using Puppeteer and Metascraper and returns an object containing various metadata about the page.
 *
 * @param {string} uri - The URL of the page to scrape information from.
 * @param {string[]} puppeteerArgs - (Optional) Additional arguments to pass to Puppeteer.
 * @param {string} puppeteerAgent - (Optional) User agent string to be used by Puppeteer.
 * @param {string} executablePath - (Optional) Path to the Puppeteer executable.
 * @returns {Promise<Object>} A Promise that resolves to an object containing scraped page information.
 * @throws {HttpsError} Throws an HttpsError with "not-found" code if the canonical URL is not found.
 */
export async function scrapePage(
  uri: string,
  puppeteerArgs = [],
  puppeteerAgent = "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
  executablePath: any
) {
  puppeteer.use(pluginStealth());

  const params: PuppeteerLaunchOptions = {
    headless: true,
    args: [...puppeteerArgs],
  };

  if (!!executablePath) {
    params.executablePath = executablePath;
  }

  const obj: Partial<PageInfo> = {};

  try {
    const browser = await puppeteer.launch(params);
    const page: Page = await browser.newPage();
    page.setUserAgent(puppeteerAgent);

    await page.goto(uri, { waitUntil: "load", timeout: 0 });
    await page.exposeFunction("request", request);
    await page.exposeFunction("urlImageIsAccessible", urlImageIsAccessible);

    console.log("Generating link preview for: " + uri);

    obj.title = await getTitle(page);
    obj.description = await getDescription(page);
    obj.domain = await getDomainName(page, uri);
    obj.img = await getImg(page, uri);
    obj.favicon = await getFavicon(page, uri);
    obj.canonicalUrl = await getCanonicalUrl(page, uri);
    await browser.close();
  } catch (e) {
    console.log("Error in Puppeteer scraper: ");
    console.log(JSON.stringify(e));
    console.log("---end of error log ---");
    throw e;
  }

  const metascraped = await tryMetascraper(uri);
  const mapMetascraper: Record<keyof Omit<PageInfo,'domain'>, keyof MetascraperData> = {
    img: "image",
    favicon: "logo",
    canonicalUrl: "url",
    clearbit: "clearbit",
    description: "description",
    title: "title",
  };
  for (const [key, value] of Object.entries(mapMetascraper)) {
    if (!obj[key as keyof Omit<PageInfo,'domain'>] && metascraped["author"]) {
      obj[key as keyof Omit<PageInfo,'domain'>] = metascraped[value];
    }
  }
  console.log("Metascraped:" + JSON.stringify(metascraped));
  if (!obj?.canonicalUrl) {
    throw new HttpsError("not-found", "Site not found");
  }
  return obj;
}
