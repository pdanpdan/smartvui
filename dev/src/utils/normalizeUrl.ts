import BASE_URL from '$dev/base';

export default function normalizeUrl(url: string) {
  const urlCleaned = `/${ url.split('/').filter(Boolean).join('/') }`;
  return urlCleaned.indexOf(BASE_URL) === 0
    ? urlCleaned
    : `${ BASE_URL }${ urlCleaned === '/' ? '' : urlCleaned }`;
}
