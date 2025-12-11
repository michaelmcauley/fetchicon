import { Config, IconSize } from "./types";

export const APPLE_TOUCH_ICON_DEFAULT_SIZES: IconSize[] = [
  "57x57",
  "60x60",
  "72x72",
  "76x76",
  "114x114",
  "120x120",
  "144x144",
  "152x152",
  "180x180",
];

export const DEFAULT_CONFIG: Config = {
  allowedTypes: ["image/svg+xml", "image/webp", "image/png", "image/x-icon"],
  checkDefaultPaths: false,
  minSize: "32x32",
};
