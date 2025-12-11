import { IconRequirements, IconSize } from "./types";

const checkFileExists = async function (url: string): Promise<boolean> {
  try {
    // try HEAD request first
    const headResponse = await fetch(url, { method: "HEAD" });
    if (headResponse.ok) {
      return true;
    }

    // if HEAD not allowed, GET first byte only
    if (headResponse.status === 405) {
      const getResponse = await fetch(url, {
        method: "GET",
        headers: {
          Range: "bytes=0-0",
        },
      });
      if (getResponse.ok || getResponse.status === 206) {
        return true;
      }
    }

    return false;
  } catch (error) {
    return false;
  }
};

const iconSizeMeetsRequirements = function (
  size: IconSize,
  requirements: IconRequirements,
): boolean {
  const dimensions = parseIconSize(size);
  const minDimensions =
    requirements.minSize && parseIconSize(requirements.minSize);
  const maxDimensions =
    requirements.maxSize && parseIconSize(requirements.maxSize);
  return (
    dimensions.w >= (minDimensions?.w || 0) &&
    dimensions.h >= (minDimensions?.h || 0) &&
    dimensions.w <= (maxDimensions?.w || Infinity) &&
    dimensions.h <= (maxDimensions?.h || Infinity)
  );
};

const parseIconSize = function (size: IconSize): { w: number; h: number } {
  const [w, h] = size
    .toLowerCase()
    .split("x")
    .map((dimension) => parseInt(dimension));
  return { w, h };
};

export { checkFileExists, iconSizeMeetsRequirements, parseIconSize };
