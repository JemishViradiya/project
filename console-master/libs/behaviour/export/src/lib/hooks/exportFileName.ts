export const exportFileName = (fileName: string, { filtered }: { filtered: boolean }) => {
  const now = new Date()
  return `${fileName}${filtered ? '_Filtered' : ''}_${String(now.getFullYear())}${String(now.getMonth() + 1).padStart(
    2,
    '0',
  )}${String(now.getDate()).padStart(2, '0')}`
}
