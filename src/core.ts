import { parseHTML } from "linkedom";

export async function fetchHtml(url: string): Promise<string> {
  let urlIsValid = validateUrl(url);
  if (!urlIsValid) {
    throw new Error("Failed to fetch HTML due to invalid URL");
  }
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; MichaelMcAuley/FetchIcon/1.0)",
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch HTML due to network error: ${response.statusText}`);
  }
  return response.text();
}

export function getIconResourcesFromHtml(
  html: string
): Map<string, { rel?: string; sizes?: string }> {
  const { document } = parseHTML(html);
  const linkElements = document.querySelectorAll("link");
  const iconResources: Map<string, { rel?: string; sizes?: string; type?: string }> = new Map();
  for (const link of linkElements) {
    const rel = link.getAttribute("rel") ?? '';
    const href = link.getAttribute("href") ?? '';
    const sizes = link.getAttribute("sizes") ?? '';
    const type = link.getAttribute("type") ?? '';

    const iconResourceRelValues = ["icon", "shortcut icon", "apple-touch-icon"];

    if (iconResourceRelValues.includes(rel) && href) {
      iconResources.set(href, { rel, sizes, type });
    }
  }
  return iconResources;
}

function validateUrl(url: string): boolean {
  if (!url || url.trim() === "") {
    return false;
  }
  const validSchemes = ["http:", "https:"];
  try {
    const urlObj = new URL(url);
    if (!validSchemes.includes(urlObj.protocol)) {
      return false;
    }
  } catch (error) {
    return false;
  }
  return true;
}
