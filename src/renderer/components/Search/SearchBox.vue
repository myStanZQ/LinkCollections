<template>
  <div class="search-box">
    <el-input
      v-model="searchQuery"
      placeholder="Search bookmarks..."
      clearable
      class="search-input"
      @input="handleSearch"
    >
      <template #prefix>
        <i class="i-heroicons-magnifying-glass" />
      </template>
    </el-input>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { debounce } from 'lodash-es'

const emit = defineEmits<{
  search: [query: string]
}>()

const searchQuery = ref('')

const handleSearch = debounce((value: string) => {
  emit('search', value)
}, 300)

watch(searchQuery, value => {
  handleSearch(value)
})
</script>

<style scoped>
.search-box {
  width: 100%;
  max-width: 500px;
}

.search-input {
  border-radius: 20px;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 20px;
  padding-left: 12px;
  padding-right: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--el-border-color-lighter);
  transition: all 0.3s;
}

.search-input :deep(.el-input__wrapper:hover) {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-color: var(--el-color-primary-light-5);
}

.search-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 2px 12px rgba(59, 130, 246, 0.15);
  border-color: var(--el-color-primary);
}

.search-input :deep(.el-input__inner) {
  height: 40px;
  line-height: 40px;
}

.search-input :deep(.el-input__prefix) {
  display: flex;
  align-items: center;
  color: var(--el-text-color-placeholder);
}
</style>
