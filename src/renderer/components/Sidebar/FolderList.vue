<template>
  <div class="folder-list">
    <div class="folder-list-header">
      <h3 class="text-sm font-semibold text-gray-600">
        {{ t('sidebar.folders') }}
      </h3>
      <el-button
        size="small"
        text
        class="add-btn"
        @click="showAddFolderDialog = true"
      >
        <i class="i-heroicons-plus" />
      </el-button>
    </div>

    <div class="folder-items">
      <div
        v-for="folder in folders"
        :key="folder.id"
        class="folder-item"
        :class="{ active: folder.id === currentFolderId }"
        @click="handleFolderClick(folder.id)"
        @contextmenu.prevent="handleContextMenu($event, folder)"
      >
        <div class="folder-item-content">
          <div
            class="folder-icon-wrapper"
            :style="{ backgroundColor: folder.color || '#3B82F6' }"
          >
            <i class="i-heroicons-folder" />
          </div>
          <span class="folder-name">{{ folder.name }}</span>
        </div>
        <el-dropdown
          trigger="click"
          @command="(command: string) => handleFolderAction(command, folder.id)"
        >
          <span
            class="folder-actions"
            @click.stop
          >
            <i class="i-heroicons-ellipsis-vertical" />
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="delete">
                <i class="i-heroicons-trash mr-2" />
                {{ t('common.delete') }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <AddFolderDialog v-model="showAddFolderDialog" />
    <EditFolderDialog
      v-model="showEditFolderDialog"
      :folder="editingFolder"
      @updated="handleFolderUpdate"
    />

    <teleport to="body">
      <div
        v-if="contextMenuVisible"
        class="context-menu"
        :style="{ left: contextMenuPosition.x + 'px', top: contextMenuPosition.y + 'px' }"
        @click.stop
      >
        <div
          class="context-menu-item"
          @click="handleFolderAction('edit', contextMenuFolder.id)"
        >
          <i class="i-heroicons-pencil" />
          <span>{{ t('common.edit') }}</span>
        </div>
        <div
          class="context-menu-item"
          @click="handleFolderAction('delete', contextMenuFolder.id)"
        >
          <i class="i-heroicons-trash" />
          <span>{{ t('common.delete') }}</span>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useFolderStore, useUIStore } from '../../stores'
import AddFolderDialog from '../Modal/AddFolderDialog.vue'
import EditFolderDialog from '../Modal/EditFolderDialog.vue'

const { t } = useI18n()
const folderStore = useFolderStore()
const uiStore = useUIStore()
const { folders, currentFolderId } = storeToRefs(folderStore)
const { setCurrentFolder, updateFolder, deleteFolder } = folderStore
const { setCurrentView } = uiStore

const showAddFolderDialog = ref(false)
const showEditFolderDialog = ref(false)
const editingFolder = ref<any>(null)
const contextMenuFolder = ref<any>(null)
const contextMenuVisible = ref(false)
const contextMenuPosition = ref({ x: 0, y: 0 })

const handleFolderClick = (id: string) => {
  setCurrentFolder(id)
  setCurrentView('bookmarks')
}

const handleContextMenu = (event: MouseEvent, folder: any) => {
  contextMenuFolder.value = folder
  contextMenuPosition.value = { x: event.clientX, y: event.clientY }
  contextMenuVisible.value = true
}

const handleFolderAction = async (command: string, id: string) => {
  if (command === 'edit') {
    hideContextMenu()

    const folder = folders.value.find(f => f.id === id)
    if (folder) {
      editingFolder.value = { ...folder }
      setTimeout(() => {
        showEditFolderDialog.value = true
      }, 50)
    }
    return
  }

  if (command === 'delete') {
    hideContextMenu()

    try {
      await ElMessageBox.confirm(
        'Are you sure you want to delete this folder? Bookmarks in this folder will be moved to uncategorized.',
        'Confirm Delete',
        {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      )
      await deleteFolder(id)
    } catch {
      // User cancelled
    }
  }
}

const handleFolderUpdate = async (updates: any) => {
  if (editingFolder.value && editingFolder.value.id) {
    try {
      await updateFolder(editingFolder.value.id, updates)
      showEditFolderDialog.value = false
    } catch (error) {
      ElMessage.error(t('message.folderAddFailed'))
    }
  }
}

const hideContextMenu = () => {
  contextMenuVisible.value = false
}

document.addEventListener('click', hideContextMenu)
</script>

<style scoped>
.folder-list {
  margin-bottom: 24px;
}

.folder-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  margin-bottom: 8px;
}

.add-btn {
  padding: 4px 8px;
}

.folder-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 8px;
}

.folder-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--el-text-color-regular);
}

.folder-item:hover {
  background-color: var(--el-fill-color-light);
}

.folder-item.active {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

.folder-item-content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  overflow: hidden;
}

.folder-icon-wrapper {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.folder-icon-wrapper i {
  font-size: 16px;
}

.folder-name {
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.folder-actions {
  padding: 4px;
  border-radius: 4px;
  opacity: 0.5;
  transition: opacity 0.2s;
  cursor: pointer;
}

.folder-item:hover .folder-actions,
.folder-item.active .folder-actions {
  opacity: 1;
}

.folder-actions:hover {
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
