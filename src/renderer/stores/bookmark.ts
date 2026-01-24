import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Bookmark } from '../types'
import { ElMessage } from 'element-plus'

export const useBookmarkStore = defineStore('bookmark', () => {
  const bookmarks = ref<Bookmark[]>([])
  const loading = ref(false)

  const fetchBookmarks = async () => {
    try {
      loading.value = true
      bookmarks.value = await window.electronAPI.getBookmarks()
    } catch (error) {
      ElMessage.error('Failed to load bookmarks')
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const addBookmark = async (bookmark: Partial<Bookmark>) => {
    try {
      const bookmarkData = {
        url: bookmark.url || '',
        title: bookmark.title || '',
        description: bookmark.description || '',
        favicon: bookmark.favicon || '',
        color: bookmark.color || '#3B82F6',
        folderId: bookmark.folderId || '',
        tags: Array.isArray(bookmark.tags) ? [...bookmark.tags] : []
      }
      const newBookmark = await window.electronAPI.addBookmark(bookmarkData)
      bookmarks.value.push(newBookmark)
      ElMessage.success('Bookmark added successfully')
      return newBookmark
    } catch (error) {
      ElMessage.error('Failed to add bookmark')
      console.error(error)
      throw error
    }
  }

  const updateBookmark = async (id: string, updates: Partial<Bookmark>, showMessage = true) => {
    try {
      const updateData: Partial<Bookmark> = {}

      if (updates.title !== undefined) {
        updateData.title = updates.title
      }
      if (updates.description !== undefined) {
        updateData.description = updates.description
      }
      if (updates.folderId !== undefined) {
        updateData.folderId = updates.folderId
      }
      if (updates.tags !== undefined) {
        updateData.tags = Array.isArray(updates.tags) ? [...updates.tags] : []
      }
      if (updates.color !== undefined) {
        updateData.color = updates.color
      }
      if (updates.favicon !== undefined) {
        updateData.favicon = updates.favicon
      }

      const updated = await window.electronAPI.updateBookmark(id, updateData)
      const index = bookmarks.value.findIndex(b => b.id === id)
      if (index > -1) {
        bookmarks.value[index] = updated
      }
      if (showMessage) {
        ElMessage.success('Bookmark updated successfully')
      }
      return updated
    } catch (error) {
      if (showMessage) {
        ElMessage.error('Failed to update bookmark')
      }
      console.error(error)
      throw error
    }
  }

  const deleteBookmark = async (id: string) => {
    try {
      await window.electronAPI.deleteBookmark(id)
      bookmarks.value = bookmarks.value.filter(b => b.id !== id)
      ElMessage.success('Bookmark deleted successfully')
    } catch (error) {
      ElMessage.error('Failed to delete bookmark')
      console.error(error)
      throw error
    }
  }

  const incrementVisitCount = async (id: string) => {
    try {
      const api = window.electronAPI as any
      if (api && typeof api.incrementVisitCount === 'function') {
        const updated = await api.incrementVisitCount(id)
        const index = bookmarks.value.findIndex(b => b.id === id)
        if (index > -1) {
          bookmarks.value[index] = updated
        }
      }
    } catch (error) {}
  }

  const clearAllBookmarks = async () => {
    try {
      const api = window.electronAPI as any
      if (api && typeof api.clearAllBookmarks === 'function') {
        await api.clearAllBookmarks()
        bookmarks.value = []
        ElMessage.success('All bookmarks cleared')
      }
    } catch (error) {
      ElMessage.error('Failed to clear bookmarks')
      throw error
    }
  }

  const searchBookmarks = (keyword: string) => {
    if (!keyword.trim()) {
      return bookmarks.value
    }

    const lowerKeyword = keyword.toLowerCase()
    return bookmarks.value.filter(
      bookmark =>
        bookmark.title.toLowerCase().includes(lowerKeyword) ||
        bookmark.url.toLowerCase().includes(lowerKeyword) ||
        bookmark.description.toLowerCase().includes(lowerKeyword)
    )
  }

  return {
    bookmarks,
    loading,
    fetchBookmarks,
    addBookmark,
    updateBookmark,
    deleteBookmark,
    incrementVisitCount,
    clearAllBookmarks,
    searchBookmarks
  }
})
