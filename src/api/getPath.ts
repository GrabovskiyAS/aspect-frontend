export function getPath(path: string): string {
  let result = ''
  result = path.substring(11, path.indexOf('/', 14))
  return result
}
