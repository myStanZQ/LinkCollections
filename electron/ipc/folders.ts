import { ipcMain } from 'electron'
import { v4 as uuidv4 } from 'uuid'
import { readJsonFile, writeJsonFile } from '../utils/storage'

interface Folder {
  id: string
  name: string
  icon: string | null
  color: string
  createdAt: string
  order: number
}

interface Bookmark {
  id: string
  folderId: string
}

const FOLDERS_FILE = 'folders.json'
const BOOKMARKS_FILE = 'bookmarks.json'

function getFolders(): Folder[] {
  return readJsonFile<Folder[]>(FOLDERS_FILE, [])
}

function saveFolders(folders: Folder[]): boolean {
  return writeJsonFile(FOLDERS_FILE, folders)
}

function getBookmarks(): Bookmark[] {
  return readJsonFile<Bookmark[]>(BOOKMARKS_FILE, [])
}

function saveBookmarks(bookmarks: Bookmark[]): boolean {
  return writeJsonFile(BOOKMARKS_FILE, bookmarks)
}

export function registerFolderHandlers(): void {
  ipcMain.handle('get-folders', () => {
    return getFolders()
  })

  ipcMain.handle('add-folder', (_, folderData: Partial<Folder>) => {
    const folders = getFolders()
    const now = new Date().toISOString()
    const maxOrder = folders.length > 0 ? Math.max(...folders.map(f => f.order)) : 0

    const newFolder: Folder = {
      id: uuidv4(),
      name: folderData.name || 'New Folder',
      icon: folderData.icon || null,
      color: folderData.color || '#3B82F6',
      createdAt: now,
      order: maxOrder + 1
    }

    folders.push(newFolder)
    if (saveFolders(folders)) {
      return newFolder
    }
    throw new Error('Failed to save folder')
  })

  ipcMain.handle('delete-folder', (_, id: string) => {
    const folders = getFolders()
    const filtered = folders.filter(f => f.id !== id)

    if (filtered.length === folders.length) {
      throw new Error('Folder not found')
    }

    if (!saveFolders(filtered)) {
      throw new Error('Failed to delete folder')
    }

    const bookmarks = getBookmarks()
    const updatedBookmarks = bookmarks.map(b => (b.folderId === id ? { ...b, folderId: '' } : b))

    if (!saveBookmarks(updatedBookmarks)) {
      throw new Error('Failed to update bookmarks')
    }

    return
  })

  ipcMain.handle('update-folder', (_, id: string, updates: Partial<Folder>) => {
    const folders = getFolders()
    const index = folders.findIndex(f => f.id === id)

    if (index === -1) {
      throw new Error('Folder not found')
    }

    const updatedFolder: Folder = {
      ...folders[index],
      ...updates
    }

    folders[index] = updatedFolder

    if (!saveFolders(folders)) {
      throw new Error('Failed to update folder')
    }

    return updatedFolder
  })

  ipcMain.handle('clearAllFolders', () => {
    if (!saveFolders([])) {
      throw new Error('Failed to clear folders')
    }

    const bookmarks = getBookmarks()
    const updatedBookmarks = bookmarks.map(b => ({ ...b, folderId: '' }))

    if (!saveBookmarks(updatedBookmarks)) {
      throw new Error('Failed to update bookmarks')
    }

    return true
  })
}
