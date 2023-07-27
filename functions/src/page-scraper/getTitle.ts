import { Page } from "puppeteer";

/**
 * Retrieves the page title from the provided Puppeteer page object using a series of fallbacks.
 * The function looks for the title in the following order of priority:
 * 1. Open Graph (og:title) meta tag content.
 * 2. Twitter Card (twitter:title) meta tag content.
 * 3. Document title.
 * 4. The innerHTML of the first h1 element if present.
 * 5. The innerHTML of the first h2 element if present.
 *
 * @param {Page} page - The Puppeteer page object from which to extract the title.
 * @returns {Promise<string | null>} A Promise that resolves to the retrieved page title,
 *                                  or null if no title is found.
 */
export const getTitle = async (page: Page): Promise<string | null> => {
  const title = await page.evaluate(() => {
    const ogTitle = document.querySelector("meta[property=\"og:title\"]") as any;
    if (ogTitle != null && ogTitle.content.length > 0) {
      return ogTitle.content;
    }
    const twitterTitle = document.querySelector("meta[name=\"twitter:title\"]") as any;
    if (twitterTitle != null && twitterTitle.content.length > 0) {
      return twitterTitle.content;
    }
    const docTitle = document.title;
    if (docTitle != null && docTitle.length > 0) {
      return docTitle;
    }
    const h1El = document.querySelector("h1");
    const h1 = h1El ? h1El.innerHTML : null;
    if (h1 != null && h1.length > 0) {
      return h1;
    }
    const h2El = document.querySelector("h2");
    const h2 = h2El ? h2El.innerHTML : null;
    if (h2 != null && h2.length > 0) {
      return h2;
    }
    return null;
  });
  return title;
};
