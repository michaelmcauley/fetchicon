import Icon from "./Icon";
import Page from "./Page";

async function fetchIcons(url: string): Promise<Icon[]> {
  const page = await Page.create(url);
  return page.getDefinedIcons();
}

export { fetchIcons };
