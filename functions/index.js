const functions = require("firebase-functions");
console.log("NodeJS: Running Firebase Functions in the " + process.env.NODE_ENV + " environment");
const linkPreviewGenerator = require("./link-preview-generator-custom/");
const { setSiteInfoAndOrReturnSite, getSiteInfo } = require("./siteInfo");

exports.getSite = functions.https.onCall(async (data, context) => {
    if (process.env.NODE_ENV != "development" && context.app == undefined) {
        throw new functions.https.HttpsError(
            'failed-precondition',
            'The function must be called from an App Check verified app.');
    }
    console.log(
        "Request: \n" + data.siteUrl
    );

    //read cache, return on hit
    const site = await getSiteInfo(data.siteUrl) || await setSiteInfoAndOrReturnSite(data.siteUrl, await linkPreviewGenerator(data.siteUrl));
    console.log(
        "Response: \n" + JSON.stringify(site)
    );
    console.log(JSON.stringify(context?.auth));
    return site;
});