import request from "request-promise-native";
import isBase64 from "is-base64";

/**
 * Checks if an image URL is accessible by making an HTTP request.
 *
 * @param {string} url - The URL of the image to check accessibility for.
 * @returns {Promise<boolean>} A Promise that resolves to true if the image URL is accessible, false otherwise.
 */
export async function urlImageIsAccessible(url: string): Promise<boolean> {
  const getUrls = (await eval('import("get-urls")')).default;
  const correctedUrls = getUrls(url);
  if (isBase64(url, { allowMime: true })) {
    return true;
  }
  if (correctedUrls.size !== 0) {
    const urlResponse = await request(correctedUrls.values().next().value);
    const contentType = urlResponse.headers?.["content-type"] ?? "";
    return new RegExp("image/*").test(contentType);
  }
  return false;
}
