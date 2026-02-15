import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Folder } from '../types'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

export const useFolderStore = defineStore('folder', () => {
  const { t } = useI18n()
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
      ElMessage.error(t('message.folderLoadFailed'))
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
      ElMessage.success(t('message.folderAdded'))
      return newFolder
    } catch (error) {
      ElMessage.error(t('message.folderAddFailed'))
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
      ElMessage.success(t('message.folderDeleted'))
    } catch (error) {
      ElMessage.error(t('message.folderDeleteFailed'))
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
      ElMessage.success(t('message.folderUpdated'))
    } catch (error) {
      ElMessage.error(t('message.folderAddFailed'))
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
      ElMessage.success(t('message.allCleared'))
    } catch (error) {
      ElMessage.error(t('message.folderDeleteFailed'))
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
