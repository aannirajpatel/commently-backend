import { onCall, HttpsError } from "firebase-functions/v2/https";
import { scrapePage } from "./page-scraper";
import { getCachedPageInfo, generatePageInfo } from "./db/pageRepository";

export const getSite = onCall(
  { enforceAppCheck: true },
  async (request) => {
    // Destructuring `request` here as required instead of in args to prevent error on trying to destructure `app` when it is undefined
    const {data} = request;

    // read cache, return on hit
    const site =
      (await getCachedPageInfo(data.siteUrl)) ||
      (await generatePageInfo(data.siteUrl));

    console.log("Resolved site info: \n" + JSON.stringify(site));
    

    console.log("Visited: ",data.siteUrl)

    return site;
  }
);
