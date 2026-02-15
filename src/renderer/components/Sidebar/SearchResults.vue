<template>
  <div
    v-if="isSearching"
    class="search-results"
  >
    <div
      v-if="searchResults.length === 0"
      class="no-results"
    >
      <i class="i-heroicons-magnifying-glass" />
      <p>{{ t('search.noResults') }}</p>
    </div>

    <div
      v-else
      class="results-list"
    >
      <div class="results-header">
        <span>{{ searchResults.length }}
          {{ searchResults.length !== 1 ? t('search.results') : '' }}</span>
        <el-button
          text
          size="small"
          @click="handleClear"
        >
          {{ t('common.cancel') }}
        </el-button>
      </div>

      <div
        v-for="bookmark in searchResults"
        :key="bookmark.id"
        class="result-item"
        @click="handleSelectBookmark(bookmark)"
      >
        <div
          v-if="bookmark.favicon"
          class="result-favicon"
        >
          <img
            :src="bookmark.favicon"
            alt=""
            @error="handleFaviconError(bookmark)"
          >
        </div>
        <div
          v-else
          class="result-favicon"
        >
          <i class="i-heroicons-globe-alt" />
        </div>

        <div class="result-content">
          <div class="result-title">
            {{ bookmark.title }}
          </div>
          <div class="result-url">
            {{ bookmark.url }}
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="searchHistory.length > 0"
      class="search-history"
    >
      <div class="history-header">
        <span>{{ t('search.recentSearches') || 'Recent searches' }}</span>
        <el-button
          text
          size="small"
          @click="handleClearHistory"
        >
          {{ t('common.cancel') }}
        </el-button>
      </div>

      <div
        v-for="(item, index) in searchHistory"
        :key="index"
        class="history-item"
        @click="handleHistoryClick(item)"
      >
        <i class="i-heroicons-clock" />
        <span>{{ item }}</span>
        <el-button
          text
          size="small"
          class="remove-btn"
          @click.stop="handleRemoveHistory(item)"
        >
          <i class="i-heroicons-x-mark" />
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useSearchStore } from '../../stores/search'
import { useBookmarkStore } from '../../stores'
import type { Bookmark } from '../../types'

const { t } = useI18n()
const searchStore = useSearchStore()
const bookmarkStore = useBookmarkStore()
const { isSearching, searchResults, searchHistory } = storeToRefs(searchStore)
const { performSearch, clearSearch, removeFromHistory, clearHistory } = searchStore

const handleSelectBookmark = (bookmark: Bookmark) => {
  window.open(bookmark.url, '_blank')
}

const handleFaviconError = (bookmark: Bookmark) => {
  bookmarkStore.updateBookmark(bookmark.id, { favicon: '' }, false)
}

const handleClear = () => {
  clearSearch()
}

const handleHistoryClick = (item: string) => {
  performSearch(item)
}

const handleRemoveHistory = (item: string) => {
  removeFromHistory(item)
}

const handleClearHistory = () => {
  clearHistory()
}
</script>

<style scoped>
.search-results {
  margin-bottom: 16px;
  border-top: 1px solid var(--el-border-color);
  padding-top: 12px;
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px 16px;
  color: var(--el-text-color-secondary);
}

.no-results i {
  font-size: 32px;
}

.no-results p {
  margin: 0;
  font-size: 14px;
}

.results-list {
  max-height: 300px;
  overflow-y: auto;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  font-weight: 600;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.result-item:hover {
  background-color: var(--el-fill-color-light);
}

.result-favicon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-favicon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.result-favicon i {
  font-size: 20px;
  color: var(--el-text-color-secondary);
}

.result-content {
  flex: 1;
  min-width: 0;
}

.result-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 2px;
}

.result-url {
  font-size: 11px;
  color: var(--el-text-color-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.search-history {
  margin-top: 12px;
  border-top: 1px solid var(--el-border-color-lighter);
  padding-top: 12px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  font-weight: 600;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s;
  position: relative;
}

.history-item:hover {
  background-color: var(--el-fill-color-light);
}

.history-item i {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  flex-shrink: 0;
}

.history-item span {
  flex: 1;
  font-size: 13px;
  color: var(--el-text-color-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.remove-btn {
  padding: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.history-item:hover .remove-btn {
  opacity: 1;
}

.remove-btn i {
  font-size: 14px;
}
</style>
