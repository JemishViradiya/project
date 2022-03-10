export class Base64 {
  static encode(str) {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
        return String.fromCharCode(`0x${p1}`)
      }),
    )
  }
  static decode(str) {
    return decodeURIComponent(
      atob(str)
        .split('')
        .map(c => {
          return `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`
        })
        .join(''),
    )
  }
}
