import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Tag } from '../types'
import { ElMessage } from 'element-plus'

export const useTagStore = defineStore('tag', () => {
  const tags = ref<Tag[]>([])
  const selectedTagIds = ref<string[]>([])
  const loading = ref(false)

  const fetchTags = async () => {
    try {
      loading.value = true
      tags.value = await window.electronAPI.getTags()
    } catch (error) {
      ElMessage.error('Failed to load tags')
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const addTag = async (tag: Partial<Tag>) => {
    try {
      const tagData = {
        name: tag.name || '',
        color: tag.color || '#3B82F6'
      }
      const newTag = await window.electronAPI.addTag(tagData)
      tags.value.push(newTag)
      ElMessage.success('Tag added successfully')
      return newTag
    } catch (error) {
      ElMessage.error('Failed to add tag')
      console.error(error)
      throw error
    }
  }

  const deleteTag = async (id: string) => {
    try {
      await window.electronAPI.deleteTag(id)
      tags.value = tags.value.filter(t => t.id !== id)
      selectedTagIds.value = selectedTagIds.value.filter(tagId => tagId !== id)
      ElMessage.success('Tag deleted successfully')
    } catch (error) {
      ElMessage.error('Failed to delete tag')
      console.error(error)
      throw error
    }
  }

  const toggleTag = (id: string) => {
    const index = selectedTagIds.value.indexOf(id)
    if (index > -1) {
      selectedTagIds.value.splice(index, 1)
    } else {
      selectedTagIds.value.push(id)
    }
  }

  const clearTags = () => {
    selectedTagIds.value = []
  }

  const updateTag = async (id: string, updates: Partial<Tag>) => {
    try {
      const updatedTag = await window.electronAPI.updateTag(id, updates)
      const index = tags.value.findIndex(t => t.id === id)
      if (index > -1) {
        tags.value[index] = updatedTag
      }
      ElMessage.success('Tag updated successfully')
    } catch (error) {
      ElMessage.error('Failed to update tag')
      console.error(error)
      throw error
    }
  }

  const selectedTags = computed(() => {
    return tags.value.filter(t => selectedTagIds.value.includes(t.id))
  })

  const clearAllTags = async () => {
    try {
      await window.electronAPI.clearAllTags()
      tags.value = []
      selectedTagIds.value = []
      ElMessage.success('All tags cleared')
    } catch (error) {
      ElMessage.error('Failed to clear tags')
      throw error
    }
  }

  return {
    tags,
    selectedTagIds,
    selectedTags,
    loading,
    fetchTags,
    addTag,
    updateTag,
    deleteTag,
    toggleTag,
    clearTags,
    clearAllTags
  }
})
