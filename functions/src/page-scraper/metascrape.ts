import { gotScraping } from 'got-scraping';

import metascraperBuilder, { Metadata } from "metascraper";
import metascraperAuthor from "metascraper-author";
import metascraperDate from "metascraper-date";
import metascraperDescription from "metascraper-description";
import metascraperImage from "metascraper-image";
import metascraperLogo from "metascraper-logo";
import metascraperClearbit from "metascraper-clearbit";
import metascraperPublisher from "metascraper-publisher";
import metascraperTitle from "metascraper-title";
import metascraperUrl from "metascraper-url";

const metascraper = metascraperBuilder([
  metascraperAuthor(),
  metascraperDate(),
  metascraperDescription(),
  metascraperImage(),
  metascraperLogo(),
  metascraperClearbit(),
  metascraperPublisher(),
  metascraperTitle(),
  metascraperUrl(),
]);

export type MetascraperData = Metadata & {
  logo?: string;
  clearbit?: string;
};

/**
 * Retrieves site information using the metascraper library with got-scraping as the HTML fetcher.
 *
 * @param {string} siteUrl - The URL of the website for which to retrieve site information.
 * @returns {Promise<Object>} A Promise that resolves to an object containing the site information extracted by metascraper.
 */
export async function tryMetascraper(siteUrl: string): Promise<MetascraperData> {
  let triedHtml: any = undefined;
  try {
    triedHtml = await gotScraping(siteUrl);
  } catch (error) {
    console.log("Error resolving triedHtml");
    throw error;
  }
  return await metascraper({ url: siteUrl, html: triedHtml.body });
}