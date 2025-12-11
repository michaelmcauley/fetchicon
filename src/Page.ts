import { parseHTML } from "linkedom";
import Icon from "./Icon";
import { Config, IconRequirements, IconSize, IconType } from "./types";
import { checkFileExists, iconSizeMeetsRequirements } from "./utils";
import { APPLE_TOUCH_ICON_DEFAULT_SIZES, DEFAULT_CONFIG } from "./constants";

class Page {
  private baseURI: string;

  private constructor(
    readonly url: string,
    private document: Document,
  ) {
    const baseElement = this.document.querySelector("base");
    this.baseURI = baseElement?.href || this.url;
  }

  async getIcons(config: Config = DEFAULT_CONFIG): Promise<Icon[]> {
    const definedIcons = this.getDefinedIcons(config);
    const defaultIcons = config.checkDefaultPaths
      ? await this.getDefaultIcons(config)
      : [];
    return [...definedIcons, ...defaultIcons];
  }

  private getDefinedIcons(requirements: IconRequirements): Icon[] {
    const linkElements = this.document.querySelectorAll("link");
    const iconRelValues = ["icon", "shortcut icon", "apple-touch-icon"];
    return Array.from(linkElements)
      .filter((link) => iconRelValues.includes(link.rel))
      .map((link) => {
        const { href, sizes, type } = link;
        const url = new URL(href, this.baseURI).toString();
        const sizesParsed = sizes?.toString().split(" ");
        return new Icon(url, sizesParsed as IconSize[], type as IconType);
      })
      .filter((icon) => {
        return icon.meetsRequirements(requirements);
      });
  }

  private async getDefaultIcons(
    requirements: IconRequirements,
  ): Promise<Icon[]> {
    const defaultPaths: string[] = [];
    if (requirements.allowedTypes.includes("image/x-icon")) {
      defaultPaths.push("/favicon.ico");
    }
    if (requirements.allowedTypes.includes("image/png")) {
      defaultPaths.push(
        ...["/apple-touch-icon.png", "/apple-touch-icon-precomposed.png"],
      );

      /*
       * there are several default sizes of apple-touch-icon images
       * which various apple devices will check for at expected paths;
       * here, we filter that list down to only sizes that meet our requirements
       * and add in the two corresponding default paths for each size
       */
      defaultPaths.push(
        ...APPLE_TOUCH_ICON_DEFAULT_SIZES.filter((size) =>
          iconSizeMeetsRequirements(size, requirements),
        )
          .map((size) => [
            `/apple-touch-icon-${size}.png`,
            `/apple-touch-icon-${size}-precomposed.png`,
          ])
          .flat(),
      );
    }

    const icons: Icon[] = [];
    for (const path of defaultPaths) {
      const iconUrl = new URL(path, this.baseURI).toString();
      if (await checkFileExists(iconUrl)) {
        icons.push(new Icon(iconUrl));
      }
    }
    return icons;
  }

  static async create(url: string): Promise<Page> {
    // verify URL is valid
    try {
      let urlObj = new URL(url);
      if (!["http:", "https:"].includes(urlObj.protocol)) {
        throw new Error(`"${url}" is not HTTP or HTTPS`);
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
