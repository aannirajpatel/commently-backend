declare function getSite(
    siteUrl: string
): Promise<ISite>;

declare function setSite(
    siteUrl: string,
    linkPreview: LinkPreviewResult
): Promise<ISite>;

declare interface LinkPreviewResult {
    title: string;
    description: string;
    domain: string;
    img: string;
    favicon: string;
    canonicalUrl: string;
}

declare interface ISite extends LinkPreviewResult {
    firestoreSiteId: string;
}