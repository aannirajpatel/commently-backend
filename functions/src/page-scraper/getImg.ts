import { Page } from "puppeteer";

const {urlImageIsAccessible} = require('./urlImageIsAccessible')

/**
 * Retrieves the URL of the main image associated with the page.
 * The function looks for the image URL in the following order of priority:
 * 1. Open Graph (og:image) meta tag content if the image is accessible.
 * 2. Image URL from the "image_src" link tag if the image is accessible.
 * 3. Twitter Card (twitter:image) meta tag content if the image is accessible.
 * 4. The URL of the first suitable image element in the page's HTML if the image is accessible.
 *    (Suitable images have reasonable width-to-height and height-to-width ratios and are not too small.)
 *
 * @param {Page} page - The Puppeteer page object representing the page to extract the image URL from.
 * @param {string} uri - The URL of the page to be used for forming absolute image URLs.
 * @returns {Promise<string | null>} A Promise that resolves to the URL of the main image associated with the page,
 *                                  or null if no suitable image is found or if the found image URLs are not accessible.
 */
export async function getImg(page: Page, uri: string | URL) {
  const img = await page.evaluate(async () => {
    const ogImg = document.querySelector('meta[property="og:image"]') as HTMLMetaElement;
    if (
      ogImg != null &&
      ogImg.content.length > 0 &&
      (await urlImageIsAccessible(ogImg.content))
    ) {
      return ogImg.content;
    }
    const imgRelLink = document.querySelector('link[rel="image_src"]') as HTMLLinkElement;
    if (
      imgRelLink != null &&
      imgRelLink.href.length > 0 &&
      (await urlImageIsAccessible(imgRelLink.href))
    ) {
      return imgRelLink.href;
    }
    const twitterImg = document.querySelector('meta[name="twitter:image"]') as HTMLMetaElement;
    if (
      twitterImg != null &&
      twitterImg.content.length > 0 &&
      (await urlImageIsAccessible(twitterImg.content))
    ) {
      return twitterImg.content;
    }

    let imgs = Array.from(document.getElementsByTagName("img"));
    if (imgs.length > 0) {
      imgs = imgs.filter((img) => {
        let addImg = true;
        if (img.naturalWidth > img.naturalHeight) {
          if (img.naturalWidth / img.naturalHeight > 3) {
            addImg = false;
          }
        } else {
          if (img.naturalHeight / img.naturalWidth > 3) {
            addImg = false;
          }
        }
        if (img.naturalHeight <= 50 || img.naturalWidth <= 50) {
          addImg = false;
        }
        return addImg;
      });
      if (imgs.length > 0) {
        imgs.forEach((img) =>
          img.src.indexOf("//") === -1
            ? (img.src = `${new URL(uri).origin}/${img.src}`)
            : img.src
        );
        return imgs[0].src;
      }
    }
    return null;
  });
  return img;
}
