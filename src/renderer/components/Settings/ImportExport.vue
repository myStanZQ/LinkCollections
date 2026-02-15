<template>
  <div class="import-export-section">
    <h2 class="section-title">
      <i class="i-heroicons-arrow-up-down" />
      {{ t('importExport.title') }}
    </h2>

    <div class="import-export-grid">
      <div class="action-card">
        <div class="action-icon">
          <i class="i-heroicons-arrow-down-tray" />
        </div>
        <h3>{{ t('importExport.exportData') }}</h3>
        <p>{{ t('importExport.exportData') }}</p>
        <div class="action-buttons">
          <el-button
            type="primary"
            :loading="exportingJson"
            @click="handleExportJson"
          >
            {{ t('importExport.jsonFormat') }}
          </el-button>
          <el-button
            :loading="exportingHtml"
            @click="handleExportHtml"
          >
            {{ t('importExport.htmlFormat') }}
          </el-button>
        </div>
      </div>

      <div class="action-card">
        <div class="action-icon">
          <i class="i-heroicons-arrow-up-tray" />
        </div>
        <h3>{{ t('importExport.importData') }}</h3>
        <p>{{ t('importExport.importData') }}</p>
        <div class="import-options">
          <el-radio-group
            v-model="importMergeMode"
            size="small"
          >
            <el-radio-button value="merge">
              {{ t('importExport.merge') }}
            </el-radio-button>
            <el-radio-button value="replace">
              {{ t('importExport.replace') }}
            </el-radio-button>
          </el-radio-group>
        </div>
        <div class="action-buttons">
          <el-button
            type="primary"
            :loading="importingJson"
            @click="handleImportJson"
          >
            {{ t('importExport.jsonFormat') }}
          </el-button>
          <el-button
            :loading="importingHtml"
            @click="handleImportHtml"
          >
            {{ t('importExport.htmlFormat') }}
          </el-button>
        </div>
      </div>
    </div>

    <el-alert
      v-if="lastImportResult"
      :title="`${t('importExport.importSuccess')}: ${lastImportResult.imported.bookmarks} ${t('bookmark.title')}, ${lastImportResult.imported.folders} ${t('folder.title')}, ${lastImportResult.imported.tags} ${t('tag.title')}`"
      type="success"
      :closable="false"
      show-icon
      style="margin-top: 16px"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { useBookmarkStore, useFolderStore, useTagStore } from '../../stores'
import type { ImportResult } from '../../types/import-export'

const { t } = useI18n()
const bookmarkStore = useBookmarkStore()
const folderStore = useFolderStore()
const tagStore = useTagStore()

const importMergeMode = ref<'merge' | 'replace'>('merge')

const exportingJson = ref(false)
const exportingHtml = ref(false)
const importingJson = ref(false)
const importingHtml = ref(false)

const lastImportResult = ref<ImportResult | null>(null)

const handleExportJson = async () => {
  try {
    exportingJson.value = true
    const result = await window.electronAPI.exportData('json')
    if (result.success) {
      ElMessage.success(`${t('importExport.exportSuccess')}: ${result.filePath}`)
    } else if (!result.canceled) {
      ElMessage.error(t('importExport.exportFailed'))
    }
  } catch (error) {
    ElMessage.error(t('importExport.exportFailed'))
    console.error(error)
  } finally {
    exportingJson.value = false
  }
}

const handleExportHtml = async () => {
  try {
    exportingHtml.value = true
    const result = await window.electronAPI.exportData('html')
    if (result.success) {
      ElMessage.success(`${t('importExport.exportSuccess')}: ${result.filePath}`)
    } else if (!result.canceled) {
      ElMessage.error(t('importExport.exportFailed'))
    }
  } catch (error) {
    ElMessage.error(t('importExport.exportFailed'))
    console.error(error)
  } finally {
    exportingHtml.value = false
  }
}

const handleImportJson = async () => {
  try {
    importingJson.value = true
    const result = await window.electronAPI.importData('json', importMergeMode.value)
    if (result.success) {
      lastImportResult.value = result as ImportResult
      await bookmarkStore.fetchBookmarks()
      await folderStore.fetchFolders()
      await tagStore.fetchTags()
      ElMessage.success(t('importExport.importSuccess'))
    } else if (!result.canceled) {
      ElMessage.error(t('importExport.importFailed'))
    }
  } catch (error) {
    ElMessage.error(t('importExport.importFailed'))
    console.error(error)
  } finally {
    importingJson.value = false
  }
}

const handleImportHtml = async () => {
  try {
    importingHtml.value = true
    const result = await window.electronAPI.importData('html', importMergeMode.value)
    if (result.success) {
      lastImportResult.value = result as ImportResult
      await bookmarkStore.fetchBookmarks()
      await folderStore.fetchFolders()
      ElMessage.success(t('importExport.importSuccess'))
    } else if (!result.canceled) {
      ElMessage.error(t('importExport.importFailed'))
    }
  } catch (error) {
    ElMessage.error(t('importExport.importFailed'))
    console.error(error)
  } finally {
    importingHtml.value = false
  }
}
</script>

<style scoped>
.import-export-section {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--el-border-color);
}

.section-title i {
  font-size: 20px;
  color: var(--el-color-primary);
}

.import-export-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.action-card {
  padding: 20px;
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  text-align: center;
}

.action-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--el-color-primary-light-9);
  border-radius: 50%;
}

.action-icon i {
  font-size: 24px;
  color: var(--el-color-primary);
}

.action-card h3 {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
}

.action-card p {
  margin: 0 0 16px;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.import-options {
  margin-bottom: 16px;
}
</style>
