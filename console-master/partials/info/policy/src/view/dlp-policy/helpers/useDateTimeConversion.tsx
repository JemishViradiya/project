const formats = {
  DATE_SHORT: {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  },
}

export const useDateConversion = () => {
  const intlInstance = ({ locale = 'en', options }) => new Intl.DateTimeFormat(locale, { ...options })

  const getDateShortFormat = (date: string, options?): string => {
    return intlInstance({
      ...options,
      options: formats['DATE_SHORT'],
    }).format(new Date(date))
  }

  return {
    getDateShortFormat,
  }
}
