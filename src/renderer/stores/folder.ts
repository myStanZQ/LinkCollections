import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Folder } from '../types'
import { ElMessage } from 'element-plus'

export const useFolderStore = defineStore('folder', () => {
  const folders = ref<Folder[]>([])
  const currentFolderId = ref<string>('')
  const loading = ref(false)

  const fetchFolders = async () => {
    try {
      loading.value = true
      folders.value = await window.electronAPI.getFolders()
      if (!currentFolderId.value && folders.value.length > 0) {
        currentFolderId.value = folders.value[0].id
      }
    } catch (error) {
      ElMessage.error('Failed to load folders')
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const addFolder = async (folder: Partial<Folder>) => {
    try {
      const folderData = {
        name: folder.name || '',
        icon: folder.icon || null,
        color: folder.color || '#3B82F6'
      }
      const newFolder = await window.electronAPI.addFolder(folderData)
      folders.value.push(newFolder)
      ElMessage.success('Folder added successfully')
      return newFolder
    } catch (error) {
      ElMessage.error('Failed to add folder')
      console.error(error)
      throw error
    }
  }

  const deleteFolder = async (id: string) => {
    try {
      await window.electronAPI.deleteFolder(id)
      folders.value = folders.value.filter(f => f.id !== id)
      if (currentFolderId.value === id) {
        currentFolderId.value = folders.value.length > 0 ? folders.value[0].id : ''
      }
      ElMessage.success('Folder deleted successfully')
    } catch (error) {
      ElMessage.error('Failed to delete folder')
      console.error(error)
      throw error
    }
  }

  const setCurrentFolder = (id: string) => {
    currentFolderId.value = id
  }

  const updateFolder = async (id: string, updates: Partial<Folder>) => {
    try {
      const updatedFolder = await window.electronAPI.updateFolder(id, updates)
      const index = folders.value.findIndex(f => f.id === id)
      if (index > -1) {
        folders.value[index] = updatedFolder
      }
      ElMessage.success('Folder updated successfully')
    } catch (error) {
      ElMessage.error('Failed to update folder')
      console.error(error)
      throw error
    }
  }

  const currentFolder = computed(() => {
    return folders.value.find(f => f.id === currentFolderId.value) || null
  })

  const clearAllFolders = async () => {
    try {
      await window.electronAPI.clearAllFolders()
      folders.value = []
      currentFolderId.value = ''
      ElMessage.success('All folders cleared')
    } catch (error) {
      ElMessage.error('Failed to clear folders')
      throw error
    }
  }

  return {
    folders,
    currentFolderId,
    currentFolder,
    loading,
    fetchFolders,
    addFolder,
    updateFolder,
    deleteFolder,
    setCurrentFolder,
    clearAllFolders
  }
})
