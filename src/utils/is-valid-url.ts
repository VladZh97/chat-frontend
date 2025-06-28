export const isValidUrl = (url: string) => {
  if (!url) return false;
  // Add https:// if not present
  const urlWithProtocol =
    url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
  return /^https:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}/gi.test(
    urlWithProtocol
  );
};
