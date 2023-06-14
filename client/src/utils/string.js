export function getValueFromQueryString(key, queryString) {
    const regex = new RegExp(`[?&]${key}=([^&#]*)`);
    const match = regex.exec(queryString);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  }