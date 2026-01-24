export const isValidUrl = (url: string): boolean => {
  if (!url) return false
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const isValidColor = (color: string): boolean => {
  if (!color) return false
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  return hexColorRegex.test(color)
}

export const validateRequired = (value: any, fieldName: string): void => {
  if (value === null || value === undefined || value === '') {
    throw new Error(`${fieldName} is required`)
  }
}

export const validateBookmarkData = (bookmark: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!bookmark.url) {
    errors.push('URL is required')
  } else if (!isValidUrl(bookmark.url)) {
    errors.push('Invalid URL format')
  }

  if (!bookmark.title || bookmark.title.trim() === '') {
    errors.push('Title is required')
  }

  if (!bookmark.folderId) {
    errors.push('Folder is required')
  }

  if (bookmark.color && !isValidColor(bookmark.color)) {
    errors.push('Invalid color format')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

export const validateFolderData = (folder: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!folder.name || folder.name.trim() === '') {
    errors.push('Folder name is required')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

export const validateTagData = (tag: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!tag.name || tag.name.trim() === '') {
    errors.push('Tag name is required')
  }

  if (!tag.color || !isValidColor(tag.color)) {
    errors.push('Valid color is required')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
