<template>
  <div class="search-bar" :class="{ 'has-results': isSearching }">
    <el-input
      ref="searchInput"
      v-model="searchQuery"
      placeholder="Search bookmarks..."
      :prefix-icon="Search"
      clearable
      @input="handleSearch"
      @clear="handleClear"
      @keydown.enter="handleEnter"
    >
      <template #append>
        <el-tooltip content="Ctrl+K" placement="top">
          <span class="shortcut-hint">⌘K</span>
        </el-tooltip>
      </template>
    </el-input>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { Search } from '@element-plus/icons-vue'
import { useSearchStore } from '../../stores/search'

const searchStore = useSearchStore()
const { isSearching } = storeToRefs(searchStore)

const searchQuery = ref('')
const searchInput = ref()

const handleSearch = () => {
  searchStore.performSearch(searchQuery.value)
}

const handleClear = () => {
  searchStore.clearSearch()
}

const handleEnter = () => {
  if (searchQuery.value.trim()) {
    searchStore.addToHistory(searchQuery.value)
  }
}

const focusSearch = () => {
  searchInput.value?.focus()
}

const handleKeydown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    focusSearch()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

defineExpose({
  focusSearch
})
</script>

<style scoped>
.search-bar {
  margin-bottom: 16px;
}

.search-bar .el-input {
  --el-input-border-radius: 8px;
}

.shortcut-hint {
  font-size: 11px;
  color: var(--el-text-color-secondary);
  cursor: default;
  user-select: none;
}
</style>
