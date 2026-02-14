<template>
  <div class="settings-view">
    <h1 class="settings-title">
      Settings
    </h1>

    <div class="settings-sections">
      <div class="settings-section">
        <h2 class="section-title">
          <i class="i-heroicons-paint-brush" />
          Appearance
        </h2>
        <div class="settings-item">
          <div class="settings-item-content">
            <div class="settings-item-label">
              Theme
            </div>
            <div class="settings-item-description">
              Choose your preferred theme
            </div>
          </div>
          <el-radio-group
            v-model="localSettings.theme"
            @change="handleThemeChange"
          >
            <el-radio-button value="light">
              Light
            </el-radio-button>
            <el-radio-button value="dark">
              Dark
            </el-radio-button>
          </el-radio-group>
        </div>
        <div class="settings-item">
          <div class="settings-item-content">
            <div class="settings-item-label">
              Language
            </div>
            <div class="settings-item-description">
              Choose your preferred language
            </div>
          </div>
          <el-select
            v-model="localSettings.language"
            placeholder="Select language"
            style="width: 180px"
            @change="handleLanguageChange"
          >
            <el-option
              label="English"
              value="en"
            />
            <el-option
              label="中文"
              value="zh"
            />
          </el-select>
        </div>
      </div>

      <div class="settings-section">
        <h2 class="section-title">
          <i class="i-heroicons-globe-alt" />
          Browser
        </h2>
        <div class="settings-item">
          <div class="settings-item-content">
            <div class="settings-item-label">
              Default Browser
            </div>
            <div class="settings-item-description">
              Primary browser for opening links
            </div>
          </div>
          <div
            class="browser-inputs"
            style="width: 400px"
          >
            <el-input
              v-model="defaultBrowserName"
              placeholder="Browser name"
              style="flex: 1"
            />
            <el-input
              v-model="defaultBrowserPath"
              placeholder="C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
              style="flex: 2"
              @change="handleBrowserChange"
            />
          </div>
        </div>
        <div class="settings-item">
          <div class="settings-item-content">
            <div class="settings-item-label">
              Available Browsers
            </div>
            <div class="settings-item-description">
              Additional browsers to choose from
            </div>
          </div>
          <div class="browser-list">
            <div
              v-for="(browser, index) in localSettings.availableBrowsers"
              :key="index"
              class="browser-item"
            >
              <div class="browser-inputs">
                <el-input
                  v-model="browser.name"
                  placeholder="Browser name"
                  style="flex: 1"
                />
                <el-input
                  v-model="browser.path"
                  placeholder="Browser path"
                  style="flex: 2"
                />
              </div>
              <el-button
                text
                type="danger"
                @click="removeBrowser(index)"
              >
                <i class="i-heroicons-x-mark" />
              </el-button>
            </div>
            <el-button
              text
              type="primary"
              @click="addBrowser"
            >
              <i class="i-heroicons-plus" />
              Add Browser
            </el-button>
          </div>
        </div>
      </div>

      <div class="settings-section">
        <h2 class="section-title">
          <i class="i-heroicons-cog-6-tooth" />
          General
        </h2>
        <div class="settings-item">
          <div class="settings-item-content">
            <div class="settings-item-label">
              Auto-fetch Favicon
            </div>
            <div class="settings-item-description">
              Automatically fetch website icons when adding bookmarks
            </div>
          </div>
          <el-switch
            v-model="localSettings.autoFetchIcon"
            @change="handleAutoFetchChange"
          />
        </div>
      </div>

      <div class="settings-section">
        <h2 class="section-title">
          <i class="i-heroicons-information-circle" />
          About
        </h2>
        <div class="settings-item">
          <div class="settings-item-content">
            <div class="settings-item-label">
              LinkCollection
            </div>
            <div class="settings-item-description">
              Version 1.0.0
            </div>
          </div>
        </div>
      </div>

      <ImportExport />

      <div class="settings-section">
        <h2 class="section-title">
          <i class="i-heroicons-trash" />
          Data Management
        </h2>
        <div class="settings-item">
          <div class="settings-item-content">
            <div class="settings-item-label">
              Clear All Data
            </div>
            <div class="settings-item-description">
              Delete all bookmarks, folders, and tags
            </div>
          </div>
          <el-button
            type="danger"
            @click="clearAllData"
          >
            Clear All
          </el-button>
        </div>
      </div>
    </div>

    <div class="settings-footer">
      <el-button @click="resetToDefaults">
        Reset to Defaults
      </el-button>
      <el-button
        type="primary"
        @click="saveSettings"
      >
        Save Settings
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onActivated } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useUIStore, useBookmarkStore, useFolderStore, useTagStore } from '../../stores'
import type { Settings } from '../../types'
import ImportExport from './ImportExport.vue'

const uiStore = useUIStore()
const bookmarkStore = useBookmarkStore()
const folderStore = useFolderStore()
const tagStore = useTagStore()
const { settings } = storeToRefs(uiStore)
const { fetchSettings, saveSettings: saveSettingsToStore } = uiStore

const localSettings = ref<Settings>({
  defaultBrowser: '',
  availableBrowsers: [],
  viewMode: 'card',
  sidebarCollapsed: false,
  theme: 'light',
  autoFetchIcon: true,
  language: 'en'
})

const defaultBrowserName = ref('')
const defaultBrowserPath = ref('')

const defaultSettings: Settings = {
  defaultBrowser: '',
  availableBrowsers: [],
  viewMode: 'card',
  sidebarCollapsed: false,
  theme: 'light',
  autoFetchIcon: true,
  language: 'en'
}

let isSaving = false

watch([defaultBrowserName, defaultBrowserPath], ([name, path]) => {
  if (name || path) {
    localSettings.value.defaultBrowser = {
      name,
      path,
      icon: 'i-heroicons-globe-alt'
    }
  } else {
    localSettings.value.defaultBrowser = ''
  }
})

watch(
  settings,
  newSettings => {
    if (newSettings && !isSaving) {
      const currentBrowsers = localSettings.value.availableBrowsers
      localSettings.value = {
        ...newSettings,
        availableBrowsers: currentBrowsers
      }

      if (typeof newSettings.defaultBrowser === 'string') {
        defaultBrowserName.value = ''
        defaultBrowserPath.value = newSettings.defaultBrowser
      } else if (newSettings.defaultBrowser && typeof newSettings.defaultBrowser === 'object') {
        defaultBrowserName.value = newSettings.defaultBrowser.name || ''
        defaultBrowserPath.value = newSettings.defaultBrowser.path || ''
      }
    }
  },
  { deep: true, immediate: true }
)

const handleThemeChange = (value: string) => {
  localSettings.value.theme = value as 'light' | 'dark'
  applyTheme(value)
}

const handleBrowserChange = (value: string) => {}

const normalizePath = (path: string): string => {
  if (!path) return ''
  let normalized = path.trim()
  if (normalized.startsWith('"') && normalized.endsWith('"')) {
    normalized = normalized.slice(1, -1)
  } else if (normalized.startsWith("'") && normalized.endsWith("'")) {
    normalized = normalized.slice(1, -1)
  }
  return normalized
}

const addBrowser = () => {
  localSettings.value.availableBrowsers.push({
    name: '',
    path: '',
    icon: 'i-heroicons-globe-alt'
  })
}

const removeBrowser = (index: number) => {
  localSettings.value.availableBrowsers.splice(index, 1)
}

const saveSettings = async () => {
  try {
    isSaving = true

    const defaultBrowserObj =
      typeof localSettings.value.defaultBrowser === 'object'
        ? localSettings.value.defaultBrowser
        : { name: '', path: localSettings.value.defaultBrowser, icon: 'i-heroicons-globe-alt' }

    const settingsToSave = {
      defaultBrowser: {
        name: defaultBrowserName.value,
        path: normalizePath(defaultBrowserPath.value),
        icon: defaultBrowserObj.icon
      },
      availableBrowsers: localSettings.value.availableBrowsers.map(b => ({
        ...b,
        path: normalizePath(b.path)
      })),
      viewMode: localSettings.value.viewMode,
      sidebarCollapsed: localSettings.value.sidebarCollapsed,
      theme: localSettings.value.theme,
      autoFetchIcon: localSettings.value.autoFetchIcon,
      language: localSettings.value.language
    }

    const savedSettings = await window.electronAPI.updateSettings(settingsToSave)
    settings.value = savedSettings

    ElMessage.success('Settings saved successfully')
  } catch (error) {
    ElMessage.error('Failed to save settings')
  } finally {
    isSaving = false
  }
}

const handleAutoFetchChange = (value: boolean) => {}

const handleLanguageChange = (value: string) => {
  applyLanguage(value)
}

const applyTheme = (theme: string) => {
  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(theme)
}

const applyLanguage = (language: string) => {
  document.documentElement.lang = language
  localStorage.setItem('app-language', language)
}

const resetToDefaults = async () => {
  try {
    localSettings.value = { ...defaultSettings }
    await saveSettingsToStore()
    applyTheme('light')
    ElMessage.success('Settings reset to defaults')
  } catch (error) {
    ElMessage.error('Failed to reset settings')
    console.error(error)
  }
}

const clearAllData = async () => {
  try {
    await ElMessageBox.confirm(
      'This will permanently delete all bookmarks, folders, and tags. This action cannot be undone.',
      'Warning',
      {
        confirmButtonText: 'Delete All',
        cancelButtonText: 'Cancel',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    )

    await bookmarkStore.clearAllBookmarks()
    await folderStore.clearAllFolders()
    await tagStore.clearAllTags()
    ElMessage.success('All data cleared successfully')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to clear data')
    }
  }
}

onMounted(async () => {
  await fetchSettings()

  if (settings.value) {
    localSettings.value = {
      ...settings.value,
      availableBrowsers: settings.value.availableBrowsers
        ? [...settings.value.availableBrowsers]
        : []
    }

    if (typeof settings.value.defaultBrowser === 'string') {
      defaultBrowserName.value = ''
      defaultBrowserPath.value = settings.value.defaultBrowser
    } else if (settings.value.defaultBrowser && typeof settings.value.defaultBrowser === 'object') {
      defaultBrowserName.value = settings.value.defaultBrowser.name || ''
      defaultBrowserPath.value = settings.value.defaultBrowser.path || ''
    }

    applyTheme(settings.value.theme)
    applyLanguage(settings.value.language || 'en')
  } else {
    localSettings.value = {
      ...defaultSettings,
      availableBrowsers: []
    }
    applyTheme('light')
    applyLanguage('en')
  }
})

onActivated(() => {
  if (settings.value) {
    applyTheme(settings.value.theme)
    applyLanguage(settings.value.language || 'en')
  }
})
</script>

<style scoped>
.settings-view {
  flex: 1;
  overflow-y: auto;
}

.settings-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0 0 24px 0;
}

.settings-sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 32px;
}

.settings-section {
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

.settings-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
}

.settings-item-content {
  flex: 1;
}

.settings-item-label {
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
}

.settings-item-description {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.browser-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 400px;
}

.browser-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.browser-inputs {
  display: flex;
  gap: 8px;
  flex: 1;
}

.settings-footer {
  position: sticky;
  bottom: 0;
  background-color: #ffffff;
  padding: 16px 0;
  border-top: 1px solid var(--el-border-color);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@media (max-width: 600px) {
  .settings-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .settings-footer {
    flex-direction: column;
  }

  .settings-footer .el-button {
    width: 100%;
  }
}
</style>
