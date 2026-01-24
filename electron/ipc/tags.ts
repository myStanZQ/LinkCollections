import { ipcMain } from 'electron'
import { v4 as uuidv4 } from 'uuid'
import { readJsonFile, writeJsonFile } from '../utils/storage'

interface Tag {
  id: string
  name: string
  color: string
  createdAt: string
}

interface Bookmark {
  id: string
  tags: string[]
}

const TAGS_FILE = 'tags.json'
const BOOKMARKS_FILE = 'bookmarks.json'

function getTags(): Tag[] {
  return readJsonFile<Tag[]>(TAGS_FILE, [])
}

function saveTags(tags: Tag[]): boolean {
  return writeJsonFile(TAGS_FILE, tags)
}

function getBookmarks(): Bookmark[] {
  return readJsonFile<Bookmark[]>(BOOKMARKS_FILE, [])
}

function saveBookmarks(bookmarks: Bookmark[]): boolean {
  return writeJsonFile(BOOKMARKS_FILE, bookmarks)
}

export function registerTagHandlers(): void {
  ipcMain.handle('get-tags', () => {
    return getTags()
  })

  ipcMain.handle('add-tag', (_, tagData: Partial<Tag>) => {
    const tags = getTags()
    const now = new Date().toISOString()

    const newTag: Tag = {
      id: uuidv4(),
      name: tagData.name || 'New Tag',
      color: tagData.color || '#3B82F6',
      createdAt: now,
      ...tagData
    }

    tags.push(newTag)
    if (saveTags(tags)) {
      return newTag
    }
    throw new Error('Failed to save tag')
  })

  ipcMain.handle('delete-tag', (_, id: string) => {
    const tags = getTags()
    const filtered = tags.filter(t => t.id !== id)

    if (filtered.length === tags.length) {
      throw new Error('Tag not found')
    }

    if (!saveTags(filtered)) {
      throw new Error('Failed to delete tag')
    }

    const bookmarks = getBookmarks()
    const updatedBookmarks = bookmarks.map(b => ({
      ...b,
      tags: b.tags.filter(tagId => tagId !== id)
    }))

    if (!saveBookmarks(updatedBookmarks)) {
      throw new Error('Failed to update bookmarks')
    }

    return
  })

  ipcMain.handle('update-tag', (_, id: string, updates: Partial<Tag>) => {
    const tags = getTags()
    const index = tags.findIndex(t => t.id === id)

    if (index === -1) {
      throw new Error('Tag not found')
    }

    const updatedTag: Tag = {
      ...tags[index],
      ...updates
    }

    tags[index] = updatedTag

    if (!saveTags(tags)) {
      throw new Error('Failed to update tag')
    }

    return updatedTag
  })

  ipcMain.handle('clearAllTags', () => {
    if (!saveTags([])) {
      throw new Error('Failed to clear tags')
    }

    const bookmarks = getBookmarks()
    const updatedBookmarks = bookmarks.map(b => ({ ...b, tags: [] }))

    if (!saveBookmarks(updatedBookmarks)) {
      throw new Error('Failed to update bookmarks')
    }

    return true
  })
}
