<template>
  <div class="app-container">
    <Sidebar />
    <div class="main-content">
      <div v-if="currentView === 'bookmarks'" class="bookmarks-view">
        <Header @search="handleSearch" />
        <CardView v-if="viewMode === 'card'" :search-query="searchQuery" />
        <ListView v-else :search-query="searchQuery" />
      </div>
      <StatsView v-else-if="currentView === 'stats'" />
      <SettingsView v-else-if="currentView === 'settings'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useUIStore, useBookmarkStore, useFolderStore, useTagStore } from './stores'
import { defineAsyncComponent } from 'vue'
import Sidebar from './components/Sidebar/index.vue'
import Header from './components/Header/index.vue'
import CardView from './components/Bookmark/CardView.vue'
import ListView from './components/Bookmark/ListView.vue'

const StatsView = defineAsyncComponent(() => import('./components/Stats/StatsView.vue'))
const SettingsView = defineAsyncComponent(() => import('./components/Settings/SettingsView.vue'))

const uiStore = useUIStore()
const bookmarkStore = useBookmarkStore()
const folderStore = useFolderStore()
const tagStore = useTagStore()

const { currentView, viewMode } = storeToRefs(uiStore)

const searchQuery = ref('')

const handleSearch = (query: string) => {
  searchQuery.value = query
}

const handleKeydown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    const searchBar = document.querySelector('.search-bar input') as HTMLInputElement
    if (searchBar) {
      searchBar.focus()
    }
  }
}

onMounted(async () => {
  try {
    await bookmarkStore.fetchBookmarks()
    await folderStore.fetchFolders()
    await tagStore.fetchTags()
    await uiStore.fetchSettings()
    window.addEventListener('keydown', handleKeydown)
  } catch (error) {
    console.error('Error during app mount:', error)
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.app-container {
  display: flex;
  gap: 16px;
  padding: 16px;
  height: 100vh;
  background-color: var(--el-bg-color-page);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.bookmarks-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
</style>
