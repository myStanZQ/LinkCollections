import type { Bookmark, Folder, Tag, Settings } from './index'

export interface ExportResult {
  success: boolean
  canceled?: boolean
  filePath?: string
}

export interface ImportResult {
  success: boolean
  canceled?: boolean
  imported: {
    bookmarks: number
    folders: number
    tags: number
  }
}

export interface ElectronAPI {
  openBrowser: (url: string, browserPath?: string) => Promise<void>
  getBookmarks: () => Promise<Bookmark[]>
  addBookmark: (bookmark: Partial<Bookmark>) => Promise<Bookmark>
  updateBookmark: (id: string, bookmark: Partial<Bookmark>) => Promise<Bookmark>
  deleteBookmark: (id: string) => Promise<void>
  clearAllBookmarks: () => Promise<boolean>
  getFolders: () => Promise<Folder[]>
  addFolder: (folder: Partial<Folder>) => Promise<Folder>
  updateFolder: (id: string, updates: Partial<Folder>) => Promise<Folder>
  deleteFolder: (id: string) => Promise<void>
  clearAllFolders: () => Promise<boolean>
  getTags: () => Promise<Tag[]>
  addTag: (tag: Partial<Tag>) => Promise<Tag>
  updateTag: (id: string, updates: Partial<Tag>) => Promise<Tag>
  deleteTag: (id: string) => Promise<void>
  clearAllTags: () => Promise<boolean>
  getSettings: () => Promise<Settings>
  updateSettings: (settings: Partial<Settings>) => Promise<Settings>
  exportData: (format: 'json' | 'html') => Promise<ExportResult>
  importData: (format: 'json' | 'html', mergeMode: 'replace' | 'merge') => Promise<ImportResult>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export {}
