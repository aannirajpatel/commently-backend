const {onCall} = require("firebase-functions/v2/https");
// eslint-disable-next-line max-len
console.log("NodeJS: Running Firebase Functions in the " + process.env.NODE_ENV + " environment");
const linkPreviewGenerator = require("./link-preview-generator-custom/");
const {setSiteInfoAndOrReturnSite, getSiteInfo} = require("./siteInfo");

exports.getSite = onCall({enforceAppCheck: true}, async ({data}) => {
  console.log(
      "Request: \n" + data.siteUrl,
  );

  // read cache, return on hit
  // eslint-disable-next-line max-len
  const site = await getSiteInfo(data.siteUrl) || await setSiteInfoAndOrReturnSite(data.siteUrl, await linkPreviewGenerator(data.siteUrl));
  console.log(
      "Response: \n" + JSON.stringify(site),
  );
  return site;
});
