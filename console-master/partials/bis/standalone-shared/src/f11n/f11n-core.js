const HeaderName = 'X-Permitted-Tenant-Features'
const ParamName = 'permittedTenantFeatures'
const PowerUpSeparator = ','
const VariantSeparator = ':'

module.exports = {
  HeaderName,
  ParamName,
  /**
   * @param {JSON} f11nJson
   */
  serialize: f11nJson => {
    return !f11nJson
      ? undefined
      : Object.entries(f11nJson)
          .map(([key, value]) => (typeof value === 'string' ? `${key}${VariantSeparator}${value}` : key))
          .join(PowerUpSeparator)
  },
  /**
   * @param {string} f11nStr
   */
  deserialize: f11nStr => {
    if (!f11nStr) return undefined
    if (typeof f11nStr !== 'string') return f11nStr
    /**
     * @type {Record<string, any>}
     */
    const json = {}
    for (const f11n of f11nStr.split(PowerUpSeparator)) {
      const [name, variant = true] = f11n.split(VariantSeparator)
      json[name] = variant
    }
    return json
  },
}
