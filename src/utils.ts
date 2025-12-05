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

export { checkFileExists };
