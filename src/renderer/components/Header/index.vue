<template>
  <div class="header">
    <div class="header-left">
      <h1 class="title">
        {{ currentFolder?.name || t('sidebar.allBookmarks') }}
      </h1>
    </div>

    <div class="header-center">
      <SearchBox @search="handleSearch" />
    </div>

    <div class="header-right">
      <el-button
        type="primary"
        class="add-btn"
        @click="showAddDialog = true"
      >
        <i class="i-heroicons-plus" />
        {{ t('bookmark.addBookmark') }}
      </el-button>
      <ViewToggle />
    </div>

    <AddBookmarkDialog v-model="showAddDialog" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useFolderStore } from '../../stores'
import SearchBox from '../Search/SearchBox.vue'
import ViewToggle from './ViewToggle.vue'
import AddBookmarkDialog from '../Modal/AddBookmarkDialog.vue'

interface Emits {
  (e: 'search', query: string): void
}

const { t } = useI18n()
const props = defineProps<{}>()
const emit = defineEmits<Emits>()

const folderStore = useFolderStore()
const { currentFolder } = storeToRefs(folderStore)

const showAddDialog = ref(false)

const handleSearch = (query: string) => {
  emit('search', query)
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color);
}

.header-left {
  flex-shrink: 0;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.title {
  font-size: 20px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
}
</style>
