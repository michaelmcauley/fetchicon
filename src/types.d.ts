type Config = {
  allowedTypes: IconType[];
  checkDefaultPaths: boolean;
  maxSize?: IconSize;
  minSize?: IconSize;
};

type IconRequirements = Pick<Config, "allowedTypes" | "maxSize" | "minSize">;

type IconSize = `${number}${"x" | "X"}${number}`;

type IconType = "image/png" | "image/svg+xml" | "image/webp" | "image/x-icon";

export type { Config, IconRequirements, IconSize, IconType };
