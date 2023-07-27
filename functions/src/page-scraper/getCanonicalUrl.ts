import { Page } from "puppeteer";

export async function getCanonicalUrl(page: Page, uri: string): Promise<string|undefined> {
  const canonicalUrl = await page.evaluate(() => {
    const ogUrlMeta = document.querySelector('meta[property="og:url"]') as HTMLMetaElement;
    const twitterUrlMetaName = document.querySelector(
      'meta[name="twitter:url"]'
    ) as HTMLMetaElement;
    const twitterUrlMetaProperty = document.querySelector(
      'meta[property="twitter:url"]'
    ) as HTMLMetaElement;
    const canonicalLink = document.querySelector("link[rel=canonical]") as HTMLLinkElement;
    const alternateUrl = document.querySelector(
      'link[rel="alternate"][hreflang="x-default"]'
    ) as HTMLLinkElement;

    if (ogUrlMeta != null && ogUrlMeta.content.length > 0) {
      return ogUrlMeta.content;
    }
    if (twitterUrlMetaName != null && twitterUrlMetaName.content.length > 0) {
      return twitterUrlMetaName.content;
    }
    if (
      twitterUrlMetaProperty != null &&
      twitterUrlMetaProperty.content.length > 0
    ) {
      return twitterUrlMetaProperty.content;
    }
    if (canonicalLink != null && canonicalLink.href.length > 0) {
      return canonicalLink.href;
    }
    if (alternateUrl != null && alternateUrl.href.length > 0) {
      return alternateUrl.href;
    }
    return null;
  });
  return canonicalUrl || uri;
}
