import { onCall, HttpsError } from "firebase-functions/v2/https";
import { scrapePage } from "./page-scraper";
// import { generatePageInfo } from "../../db/pageRepository";
import { getCachedPageInfo, generatePageInfo } from "./db/pageRepository";

export const getSite = onCall(
  { enforceAppCheck: false },
  async (request) => {
    // Destructuring `request` here as required instead of in args to prevent error on trying to destructure `app` when it is undefined
    const {data} = request;
    
    // if (process.env.NODE_ENV != "development" && !request.app) {
    //   throw new HttpsError(
    //     "failed-precondition",
    //     "The function must be called from an App Check verified app."
    //   );
    // }

    // console.log("Request: \n" + data.siteUrl);

    // // read cache, return on hit
    const site =
      (await getCachedPageInfo(data.siteUrl)) ||
      (await generatePageInfo(data.siteUrl));

    console.log("Resolved site info: \n" + JSON.stringify(site));
    //console.log(JSON.stringify(context?.auth));
    
    // return site;
    console.log("Visited: ",data.siteUrl)

    return site;
  }
);
