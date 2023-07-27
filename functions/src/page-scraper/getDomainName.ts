import { Page } from "puppeteer";

export async function getDomainName (page: Page, uri: string): Promise<string> {
  const domainName = await page.evaluate(() => {
    const canonicalLink = document.querySelector("link[rel=canonical]") as HTMLLinkElement;
    if (canonicalLink != null && canonicalLink.href.length > 0) {
      return canonicalLink.href;
    }
    const ogUrlMeta = document.querySelector("meta[property=\"og:url\"]") as HTMLMetaElement;
    if (ogUrlMeta != null && ogUrlMeta.content.length > 0) {
      return ogUrlMeta.content;
    }
    return null;
  });
  return domainName != null ?
    new URL(domainName).hostname.replace("www.", "") :
    new URL(uri).hostname.replace("www.", "");
};
