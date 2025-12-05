import { parseHTML } from "linkedom";
import Icon from "./Icon";

class Page {
  private constructor(
    readonly url: string,
    private document: Document,
  ) {}

  get baseURI(): string {
    const baseElement = this.document.querySelector("base");
    return baseElement?.href || this.url;
  }

  getDefinedIcons(): Icon[] {
    const linkElements = this.document.querySelectorAll("link");
    const iconRelValues = ["icon", "shortcut icon", "apple-touch-icon"];
    return Array.from(linkElements)
      .filter((link) => iconRelValues.includes(link.rel))
      .map((link) => {
        const { href, rel, sizes, type } = link;
        const url = new URL(href, this.baseURI);
        return new Icon(url.toString());
      });
  }

  static async create(url: string): Promise<Page> {
    // verify URL is valid
    try {
      let urlObj = new URL(url);
      if (!["http:", "https:"].includes(urlObj.protocol)) {
        throw new Error(`"${url}" must be HTTP or HTTPS`);
      }
    } catch (error) {
      throw new Error(`"${url}" is not a valid URL`);
    }

    // fetch HTML
    const response = await fetch(url);
    const html = await response.text();

    // convert to Document object (using linkedom library)
    const { document } = parseHTML(html);

    // we have everything we need to instantiate the Page now
    return new Page(url, document);
  }
}

export default Page;
