<template>
  <div
    class="sidebar"
    :class="{ collapsed: sidebarCollapsed }"
  >
    <div class="sidebar-header">
      <div
        v-if="!sidebarCollapsed"
        class="logo"
      >
        <i class="i-heroicons-link" />
        <span>LinkCollection</span>
      </div>
      <el-button
        text
        class="collapse-btn"
        @click="toggleSidebar"
      >
        <i :class="sidebarCollapsed ? 'i-heroicons-chevron-right' : 'i-heroicons-chevron-left'" />
      </el-button>
    </div>

    <div
      v-if="!sidebarCollapsed"
      class="sidebar-content"
    >
      <SearchBar />
      <SearchResults />
      <FolderList />
      <TagList />
    </div>

    <div class="sidebar-footer">
      <el-button
        text
        class="footer-btn left-btn"
        title="Statistics"
        @click="handleStatsClick"
      >
        <i class="i-heroicons-chart-bar footer-icon" />
        <span v-if="!sidebarCollapsed">Stats</span>
      </el-button>
      <el-button
        text
        class="footer-btn right-btn"
        title="Settings"
        @click="handleSettingsClick"
      >
        <i class="i-heroicons-cog-6-tooth footer-icon" />
        <span v-if="!sidebarCollapsed">Settings</span>
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUIStore } from '../../stores'
import FolderList from './FolderList.vue'
import TagList from './TagList.vue'
import SearchBar from './SearchBar.vue'
import SearchResults from './SearchResults.vue'

const uiStore = useUIStore()
const { sidebarCollapsed, currentView } = storeToRefs(uiStore)
const { toggleSidebar, setCurrentView } = uiStore

const handleStatsClick = () => {
  if (currentView.value === 'stats') {
    setCurrentView('bookmarks')
  } else {
    setCurrentView('stats')
  }
}

const handleSettingsClick = () => {
  setCurrentView('settings')
}
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: width 0.3s ease;
  width: 240px;
  padding: 16px;
  max-height: calc(100vh - 32px);
}

.sidebar.collapsed {
  width: 64px;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 4px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-color-primary);
}

.logo i {
  font-size: 20px;
}

.collapse-btn {
  padding: 8px;
}

.collapse-btn:hover {
  background-color: var(--el-fill-color-light);
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar-content::-webkit-scrollbar {
  width: 4px;
}

.sidebar-content::-webkit-scrollbar-thumb {
  background-color: var(--el-fill-color-darker);
  border-radius: 2px;
}

.sidebar-footer {
  display: flex;
  gap: 10px;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color);
  align-items: center;
}

.footer-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex: 1;
  padding: 10px 12px;
  color: var(--el-text-color-regular);
  box-sizing: border-box;
}

.footer-btn.left-btn {
  justify-content: flex-start;
}

.footer-btn.right-btn {
  justify-content: flex-end;
}

.footer-btn .footer-icon {
  width: 20px;
  height: 20px;
  font-size: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.footer-btn span {
  display: inline-block;
}

.footer-btn:hover {
  background-color: var(--el-fill-color-light);
}
</style>
