export function stringify(obj: unknown): string {
  return JSON.stringify(obj, null, 2);
}

export function stringifyHtml(obj: unknown): string {
  return JSON.stringify(obj, null, 2).split('"').join('&quot;');
}
