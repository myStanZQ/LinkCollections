<template>
  <el-button-group class="view-toggle">
    <el-button
      :type="currentView === 'card' ? 'primary' : ''"
      class="view-btn"
      @click="handleViewChange('card')"
    >
      <i class="i-heroicons-squares-2x2" />
    </el-button>
    <el-button
      :type="currentView === 'list' ? 'primary' : ''"
      class="view-btn"
      @click="handleViewChange('list')"
    >
      <i class="i-heroicons-list-bullet" />
    </el-button>
  </el-button-group>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUIStore } from '../../stores'

const uiStore = useUIStore()
const { viewMode } = storeToRefs(uiStore)
const { setViewMode } = uiStore

const currentView = computed(() => viewMode.value)

const handleViewChange = (mode: 'card' | 'list') => {
  setViewMode(mode)
}
</script>

<style scoped>
.view-toggle {
  display: flex;
  border-radius: 8px;
}

.view-btn {
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
}

.view-btn:hover {
  background-color: var(--el-fill-color-light);
}

.view-btn.is-active {
  background-color: var(--el-color-primary);
  color: white;
}
</style>
