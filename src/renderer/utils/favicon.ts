export const getFaviconUrl = (url: string): string => {
  try {
    let urlStr = url
    if (!urlStr.startsWith('http://') && !urlStr.startsWith('https://')) {
      urlStr = 'https://' + urlStr
    }

    const urlObj = new URL(urlStr)
    const domain = urlObj.hostname

    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
    return faviconUrl
  } catch (error) {
    console.error('Invalid URL for favicon:', url, error)
    return ''
  }
}

export const shouldFetchFavicon = (url: string): boolean => {
  try {
    let urlStr = url
    if (!urlStr.startsWith('http://') && !urlStr.startsWith('https://')) {
      urlStr = 'https://' + urlStr
    }
    new URL(urlStr)
    return true
  } catch (error) {
    return false
  }
}
