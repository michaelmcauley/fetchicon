#!/usr/bin/env node

import { fetchIcons } from "../src/index";

async function main() {
  // Get the URL from command line arguments
  const url = process.argv[2];

  if (!url) {
    console.error("Usage: bun run script/fetch-icon-urls.ts <url>");
    console.error(
      "Example: bun run script/fetch-icon-urls.ts https://example.com",
    );
    process.exit(1);
  }

  try {
    console.log(`Fetching icons for ${url}`);
    const icons = await fetchIcons(url);

    if (icons.length === 0) {
      console.log("No icons found");
    } else {
      const subject = icons.length > 1 ? "icons" : "icon";
      console.log(`Found ${subject}!`);
      icons.forEach((icon) => console.log(`» ${icon.url}`));
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
