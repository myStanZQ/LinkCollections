<template>
  <div class="card-view">
    <div
      v-if="filteredBookmarks.length === 0"
      class="empty-state"
    >
      <i class="i-heroicons-bookmark text-6xl text-gray-300" />
      <p class="text-gray-500">
        {{ searchQuery ? 'No bookmarks match your search.' : 'No bookmarks in this folder.' }}
      </p>
      <p
        v-if="!searchQuery"
        class="text-gray-400 text-sm mt-2"
      >
        Add a bookmark using button above
      </p>
    </div>

    <div
      v-else
      class="card-grid"
    >
      <BookmarkCard
        v-for="bookmark in filteredBookmarks"
        :key="bookmark.id"
        :bookmark="bookmark"
        :search-query="searchQuery"
        @edit="handleEdit"
      />
    </div>

    <EditDialog
      v-model="editDialogVisible"
      :bookmark="editingBookmark"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useBookmarkStore, useFolderStore, useTagStore } from '../../stores'
import BookmarkCard from './BookmarkCard.vue'
import EditDialog from '../Modal/EditDialog.vue'

interface Props {
  searchQuery?: string
}

const props = withDefaults(defineProps<Props>(), {
  searchQuery: ''
})

const bookmarkStore = useBookmarkStore()
const folderStore = useFolderStore()
const tagStore = useTagStore()
const { bookmarks } = storeToRefs(bookmarkStore)
const { currentFolderId } = storeToRefs(folderStore)
const { selectedTagIds } = storeToRefs(tagStore)

const editDialogVisible = ref(false)
const editingBookmark = ref<any>(null)

const filteredBookmarks = computed(() => {
  let filtered = bookmarks.value

  if (currentFolderId.value) {
    filtered = filtered.filter(b => b.folderId === currentFolderId.value)
  }

  if (selectedTagIds.value.length > 0) {
    filtered = filtered.filter(b => selectedTagIds.value.some(tagId => b.tags.includes(tagId)))
  }

  if (props.searchQuery && props.searchQuery.trim()) {
    const query = props.searchQuery.toLowerCase()
    filtered = filtered.filter(
      b =>
        b.title.toLowerCase().includes(query) ||
        b.url.toLowerCase().includes(query) ||
        b.description.toLowerCase().includes(query)
    )
  }

  return filtered
})

const handleEdit = (bookmark: any) => {
  editingBookmark.value = bookmark
  editDialogVisible.value = true
}
</script>

<style scoped>
.card-view {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: min-content;
  gap: 4px;
  min-height: 0;
  height: 100%;
}

@media (min-width: 1600px) {
  .card-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
  }
}

@media (max-width: 1200px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
  }
}

@media (max-width: 900px) {
  .card-grid {
    grid-template-columns: 1fr;
    gap: 4px;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 400px;
  color: var(--el-text-color-secondary);
}

.empty-state p {
  margin: 0;
}
</style>
