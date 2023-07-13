const admin = require('firebase-admin');
admin.initializeApp();
const crypto = require('crypto');
const { hashed } = require('./helpers');
const db = admin.database();

const setSiteInfoAndOrReturnSite = async (siteUrl, linkPreview) => {
    const siteUrlsRef = db.ref("siteUrls");
    const siteUrlHash = hashed(siteUrl);
    console.log("Received linkPreview obj in setSiteInfoAndOrReturnSite: " + JSON.stringify(linkPreview));
    const site = { ...linkPreview, firestoreSiteId: hashed(linkPreview.canonicalUrl) };
    try {
        await siteUrlsRef.update({
            [siteUrlHash]: site
        });
        console.error("Saved siteInfo for siteUrl: " + siteUrl);
    } catch (error) {
        console.error("Cannot save site mapping for siteUrl:`" + siteUrl + "`");
        console.error(error);
    }
    return site;
}

// Reads the realtime db to get site ref
const getSiteInfo = async (siteUrl) => {
    const siteUrlHash = crypto.createHash('sha256').update(siteUrl).digest('hex');
    const siteRef = db.ref(`siteUrls/${siteUrlHash}`);
    try {
        console.log("Trying cached siteInfo...");
        const cachedSiteInfo = (await siteRef.once("value")).toJSON();
        if (cachedSiteInfo) console.log("Found cached site info!");
        return cachedSiteInfo;
    } catch (e) {
        console.log("Site info not found, adding new siteUrl to realtime db...");
        return undefined;
    }
}

module.exports = { getSiteInfo, setSiteInfoAndOrReturnSite };