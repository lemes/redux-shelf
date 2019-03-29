export function entries(obj = {}) {
  return Object.keys(obj).map((key) => [key, obj[key]])
}

export function guaranteeArray(param = []) {
  return Array.isArray(param) ? param : [param]
}
