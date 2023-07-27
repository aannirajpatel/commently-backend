import * as admin from "firebase-admin";
import { createHash } from "crypto";
import { hashed } from "../utils";
import { scrapePage } from "../page-scraper"

admin.initializeApp();
const db = admin.database();

/**
 * Generates and saves page information in the Realtime Database.
 * 
 * @param {string} pageUrl - The URL of the page for which to generate and store information.
 * @returns {Promise<Object>} A Promise that resolves to the pageData object containing page information.
 */
export const generatePageInfo = async (pageUrl) => {
  const scraped = await scrapePage(pageUrl);
  const pageRef = db.ref("page");
  const pageHash = hashed(pageUrl);

  console.log("Scraped page information: " +JSON.stringify(scraped));
  
  const pageId = hashed(scraped.canonicalUrl);
  const pageData = {
    ...scraped,
    pageId,
  };
  
  try {
    await pageRef.update({
      [pageHash]: pageData,
    });
    await pageRef.update({
      [pageId]: pageData,
    });
    console.log("Saved pageInfo for pageUrl: " + pageUrl);
  } catch (error) {
    console.error("Cannot save page mapping for pageUrl:`" + pageUrl + "`");
    console.error(error);
  }
  return pageData;
};

/**
 * Retrieves cached page information from the Realtime Database based on the given pageUrl.
 * 
 * @param {string} pageUrl - The URL of the page for which to retrieve cached information.
 * @returns {Promise<Object | undefined>} A Promise that resolves to the cached pageData object, or undefined if the page data is not cached.
 */
export const getCachedPageInfo = async (pageUrl) => {
  const pageRef = db.ref(`page/${hashed(pageUrl)}`);
  try {
    console.log("Trying cached pageInfo...");
    const cachedPageInfo = (await pageRef.once("value")).toJSON();
    if (cachedPageInfo) {
      console.log("Found cached page info!");
    }
    return cachedPageInfo;
  } catch (e) {
    console.log("Page info not found, adding new pageUrl to realtime db...");
    return undefined;
  }
};