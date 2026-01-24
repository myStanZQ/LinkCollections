<template>
  <div class="tag-list">
    <div class="tag-list-header">
      <h3 class="text-sm font-semibold text-gray-600">Tags</h3>
      <el-button
        size="small"
        text
        @click="showAddTagDialog = true"
        class="add-btn"
      >
        <i class="i-heroicons-plus" />
      </el-button>
    </div>

    <div class="tag-items">
      <div
        v-for="tag in tags"
        :key="tag.id"
        class="tag-item"
        :class="{ active: selectedTagIds.includes(tag.id) }"
        @click="handleTagClick(tag.id)"
        @contextmenu.prevent="handleContextMenu($event, tag)"
      >
        <div class="tag-dot" :style="{ backgroundColor: tag.color }" />
        <span class="tag-name">{{ tag.name }}</span>
      </div>
    </div>

    <AddTagDialog v-model="showAddTagDialog" />
    <EditTagDialog v-model="showEditTagDialog" :tag="editingTag" @updated="handleTagUpdate" />

    <teleport to="body">
      <div
        v-if="contextMenuVisible"
        class="context-menu"
        :style="{ left: contextMenuPosition.x + 'px', top: contextMenuPosition.y + 'px' }"
        @click.stop
      >
        <div class="context-menu-item" @click="handleTagAction('edit', contextMenuTag.id)">
          <i class="i-heroicons-pencil" />
          <span>Edit</span>
        </div>
        <div class="context-menu-item" @click="handleTagAction('delete', contextMenuTag.id)">
          <i class="i-heroicons-trash" />
          <span>Delete</span>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useTagStore, useUIStore } from '../../stores'
import { ElMessageBox } from 'element-plus'
import AddTagDialog from '../Modal/AddTagDialog.vue'
import EditTagDialog from '../Modal/EditTagDialog.vue'

const tagStore = useTagStore()
const uiStore = useUIStore()
const { tags, selectedTagIds } = storeToRefs(tagStore)
const { toggleTag, updateTag, deleteTag, addTag } = tagStore
const { setCurrentView } = uiStore

const showAddTagDialog = ref(false)
const showEditTagDialog = ref(false)
const editingTag = ref<any>(null)
const contextMenuTag = ref<any>(null)
const contextMenuVisible = ref(false)
const contextMenuPosition = ref({ x: 0, y: 0 })

const handleTagClick = (id: string) => {
  toggleTag(id)
  setCurrentView('bookmarks')
}

const handleContextMenu = (event: MouseEvent, tag: any) => {
  contextMenuTag.value = tag
  contextMenuPosition.value = { x: event.clientX, y: event.clientY }
  contextMenuVisible.value = true
}

const handleTagAction = async (command: string, id: string) => {
  if (command === 'edit') {
    hideContextMenu()

    const tag = tags.value.find(t => t.id === id)
    if (tag) {
      editingTag.value = { ...tag }
      setTimeout(() => {
        showEditTagDialog.value = true
      }, 50)
    }
    return
  }

   if (command === 'delete') {
    hideContextMenu()

    try {
      await ElMessageBox.confirm(
        'Are you sure you want to delete this tag?',
        'Confirm Delete',
        {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      )
      await deleteTag(id)
    } catch {
      // User cancelled
    }
  }
}

const handleTagUpdate = async (updates: any) => {
  if (editingTag.value && editingTag.value.id) {
    try {
      await updateTag(editingTag.value.id, updates)
      showEditTagDialog.value = false
    } catch (error) {
      ElMessage.error('Failed to update tag')
    }
  }
}

const hideContextMenu = () => {
  contextMenuVisible.value = false
}

document.addEventListener('click', hideContextMenu)

</script>

<style scoped>
.tag-list {
  margin-bottom: 24px;
}

.tag-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  margin-bottom: 8px;
}

.add-btn {
  padding: 4px 8px;
}

.tag-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 8px;
}

.tag-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--el-text-color-regular);
}

.tag-item:hover {
  background-color: var(--el-fill-color-light);
}

.tag-item.active {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

.tag-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.tag-name {
  font-size: 14px;
  flex: 1;
}

.tag-actions {
  padding: 4px;
  border-radius: 4px;
  opacity: 0.5;
  transition: opacity 0.2s;
  cursor: pointer;
}

.tag-item:hover .tag-actions,
.tag-item.active .tag-actions {
  opacity: 1;
}

.tag-actions:hover {
  background-color: var(--el-fill-color);
}

.context-menu {
  position: fixed;
  z-index: 9999;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  padding: 4px 0;
  min-width: 150px;
}

.context-menu .context-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.context-menu .context-menu-item:hover {
  background-color: var(--el-fill-color-light);
}

.context-menu .context-menu-item i {
  font-size: 16px;
}
</style>
