const metascraper = require('metascraper')([
    require('metascraper-author')(),
    require('metascraper-date')(),
    require('metascraper-description')(),
    require('metascraper-image')(),
    require('metascraper-logo')(),
    require('metascraper-clearbit')(),
    require('metascraper-publisher')(),
    require('metascraper-title')(),
    require('metascraper-url')()
]);

const got = require('got');

module.exports = async (siteUrl) => {
    console.log("Starting metascraper");
    try {
        const { body: html, url } = await got(siteUrl);
        return await metascraper({ html, url });
    } catch (error) {
        console.log("--- Metascraper error log ---");
        console.log(JSON.stringify(error));
        console.log("--- log ends ---");
        return {};
    }
};