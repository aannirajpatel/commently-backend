import { Page } from "puppeteer";
import { urlImageIsAccessible } from "./urlImageIsAccessible";

export async function getFavicon(page: Page, uri: string): Promise<string | null> {
  const noLinkIcon = `${new URL(uri).origin}/favicon.ico`;
  if (await urlImageIsAccessible(noLinkIcon)) {
    return noLinkIcon;
  }

  const favicon = await page.evaluate(async () => {
    const icon16Sizes = document.querySelector('link[rel=icon][sizes="16x16"]') as HTMLLinkElement;
    if (
      icon16Sizes &&
      icon16Sizes.href.length > 0 &&
      (await urlImageIsAccessible(icon16Sizes.href))
    ) {
      return icon16Sizes.href;
    }

    const shortcutIcon = document.querySelector('link[rel="shortcut icon"]') as HTMLLinkElement;
    if (
      shortcutIcon &&
      shortcutIcon.href.length > 0 &&
      (await urlImageIsAccessible(shortcutIcon.href))
    ) {
      return shortcutIcon.href;
    }

    const icons = document.querySelectorAll("link[rel=icon]") as NodeListOf<HTMLLinkElement>;
    for (let i = 0; i < icons.length; i++) {
      if (
        icons[i] &&
        icons[i].href.length > 0 &&
        (await urlImageIsAccessible(icons[i].href))
      ) {
        return icons[i].href;
      }
    }

    const appleTouchIcons = document.querySelectorAll(
      'link[rel="apple-touch-icon"],link[rel="apple-touch-icon-precomposed"]'
    ) as NodeListOf<HTMLLinkElement>;
    for (let i = 0; i < appleTouchIcons.length; i++) {
      if (
        appleTouchIcons[i] &&
        appleTouchIcons[i].href.length > 0 &&
        (await urlImageIsAccessible(appleTouchIcons[i].href))
      ) {
        return appleTouchIcons[i].href;
      }
    }

    return null;
  });

  return favicon;
}
