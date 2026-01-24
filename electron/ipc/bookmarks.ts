import { ipcMain } from 'electron'
import { v4 as uuidv4 } from 'uuid'
import { readJsonFile, writeJsonFile } from '../utils/storage'

interface Bookmark {
  id: string
  url: string
  title: string
  description: string
  favicon: string
  color: string
  folderId: string
  tags: string[]
  visitCount: number
  lastVisited: string | null
  createdAt: string
  updatedAt: string
}

const BOOKMARKS_FILE = 'bookmarks.json'

function getBookmarks(): Bookmark[] {
  return readJsonFile<Bookmark[]>(BOOKMARKS_FILE, [])
}

function saveBookmarks(bookmarks: Bookmark[]): boolean {
  return writeJsonFile(BOOKMARKS_FILE, bookmarks)
}

export function registerBookmarkHandlers(): void {
  ipcMain.handle('get-bookmarks', () => {
    return getBookmarks()
  })

  ipcMain.handle('add-bookmark', (_, bookmarkData: Partial<Bookmark>) => {
    const bookmarks = getBookmarks()
    const now = new Date().toISOString()
    const newBookmark: Bookmark = {
      id: uuidv4(),
      url: bookmarkData.url || '',
      title: bookmarkData.title || bookmarkData.url || '',
      description: bookmarkData.description || '',
      favicon: bookmarkData.favicon || '',
      color: bookmarkData.color || '#3B82F6',
      folderId: bookmarkData.folderId || '',
      tags: bookmarkData.tags || [],
      visitCount: 0,
      lastVisited: null,
      createdAt: now,
      updatedAt: now,
      ...bookmarkData
    }

    bookmarks.push(newBookmark)

    if (saveBookmarks(bookmarks)) {
      return newBookmark
    }
    throw new Error('Failed to save bookmark')
  })

  ipcMain.handle('update-bookmark', (_, id: string, updates: Partial<Bookmark>) => {
    const bookmarks = getBookmarks()
    const index = bookmarks.findIndex(b => b.id === id)

    if (index === -1) {
      throw new Error('Bookmark not found')
    }

    bookmarks[index] = {
      ...bookmarks[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    if (saveBookmarks(bookmarks)) {
      return bookmarks[index]
    }
    throw new Error('Failed to update bookmark')
  })

  ipcMain.handle('delete-bookmark', (_, id: string) => {
    const bookmarks = getBookmarks()
    const filtered = bookmarks.filter(b => b.id !== id)

    if (filtered.length === bookmarks.length) {
      throw new Error('Bookmark not found')
    }

    if (saveBookmarks(filtered)) {
      return
    }
    throw new Error('Failed to delete bookmark')
  })

  ipcMain.handle('increment-visit-count', (_, id: string) => {
    const bookmarks = getBookmarks()
    const index = bookmarks.findIndex(b => b.id === id)

    if (index === -1) {
      throw new Error('Bookmark not found')
    }

    bookmarks[index] = {
      ...bookmarks[index],
      visitCount: bookmarks[index].visitCount + 1,
      lastVisited: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (saveBookmarks(bookmarks)) {
      return bookmarks[index]
    }
    throw new Error('Failed to update visit count')
  })

  ipcMain.handle('clearAllBookmarks', () => {
    if (saveBookmarks([])) {
      return true
    }
    throw new Error('Failed to clear bookmarks')
  })
}
