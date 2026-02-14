import type { Bookmark } from './bookmark'
import type { Folder } from './folder'
import type { Tag } from './tag'

export interface ExportData {
  version: string
  exportedAt: string
  bookmarks: Bookmark[]
  folders: Folder[]
  tags: Tag[]
}

export interface ImportOptions {
  mergeMode: 'replace' | 'merge'
  generateNewIds: boolean
}

export interface ImportResult {
  success: boolean
  imported: {
    bookmarks: number
    folders: number
    tags: number
  }
  skipped: number
  errors: string[]
}

export interface BookmarkFolder {
  name: string
  children: BookmarkFolder[]
  bookmarks: ParsedBookmark[]
}

export interface ParsedBookmark {
  title: string
  url: string
  addDate?: string
}

export type ExportFormat = 'json' | 'html'
