<template>
  <div class="stats-view">
    <h1 class="stats-title">Statistics</h1>

    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon total">
          <i class="i-heroicons-bookmark" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ totalBookmarks }}</div>
          <div class="stat-label">Total Bookmarks</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon folders">
          <i class="i-heroicons-folder" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ totalFolders }}</div>
          <div class="stat-label">Folders</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon tags">
          <i class="i-heroicons-tag" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ totalTags }}</div>
          <div class="stat-label">Tags</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon visits">
          <i class="i-heroicons-chart-bar" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ totalVisits }}</div>
          <div class="stat-label">Total Visits</div>
        </div>
      </div>
    </div>

    <div class="stats-charts">
      <div class="chart-section">
        <h2 class="section-title">Bookmarks by Folder</h2>
        <div ref="folderChartRef" class="chart-container"></div>
      </div>

      <div class="chart-section">
        <h2 class="section-title">Bookmarks by Tag</h2>
        <div ref="tagChartRef" class="chart-container"></div>
      </div>
    </div>

    <div class="stats-lists">
      <div class="list-section">
        <h2 class="section-title">Most Visited</h2>
        <div class="list-items">
          <div v-for="bookmark in mostVisitedBookmarks" :key="bookmark.id" class="list-item">
            <div class="list-item-content">
              <div class="list-item-title">{{ bookmark.title }}</div>
              <div class="list-item-url">{{ bookmark.url }}</div>
            </div>
            <div class="list-item-count">
              <i class="i-heroicons-chart-bar" />
              {{ bookmark.visitCount || 0 }}
            </div>
          </div>
          <div v-if="mostVisitedBookmarks.length === 0" class="empty-list">No visit data yet</div>
        </div>
      </div>

      <div class="list-section">
        <h2 class="section-title">Recently Added</h2>
        <div class="list-items">
          <div v-for="bookmark in recentlyAddedBookmarks" :key="bookmark.id" class="list-item">
            <div class="list-item-content">
              <div class="list-item-title">{{ bookmark.title }}</div>
              <div class="list-item-url">{{ bookmark.url }}</div>
            </div>
            <div class="list-item-date">
              {{ formatDate(bookmark.createdAt) }}
            </div>
          </div>
          <div v-if="recentlyAddedBookmarks.length === 0" class="empty-list">No bookmarks yet</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import * as echarts from 'echarts'
import { storeToRefs } from 'pinia'
import { useBookmarkStore, useFolderStore, useTagStore } from '../../stores'

const bookmarkStore = useBookmarkStore()
const folderStore = useFolderStore()
const tagStore = useTagStore()
const { bookmarks } = storeToRefs(bookmarkStore)
const { folders } = storeToRefs(folderStore)
const { tags } = storeToRefs(tagStore)

const folderChartRef = ref<HTMLElement>()
const tagChartRef = ref<HTMLElement>()
let folderChart: echarts.ECharts | null = null
let tagChart: echarts.ECharts | null = null

const totalBookmarks = computed(() => bookmarks.value.length)
const totalFolders = computed(() => folders.value.length)
const totalTags = computed(() => tags.value.length)
const totalVisits = computed(() => bookmarks.value.reduce((sum, b) => sum + (b.visitCount || 0), 0))

const mostVisitedBookmarks = computed(() => {
  return [...bookmarks.value].sort((a, b) => (b.visitCount || 0) - (a.visitCount || 0)).slice(0, 5)
})

const recentlyAddedBookmarks = computed(() => {
  return [...bookmarks.value]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
})

const bookmarksByFolder = computed(() => {
  return folders.value.map(folder => ({
    name: folder.name,
    value: bookmarks.value.filter(b => b.folderId === folder.id).length
  }))
})

const bookmarksByTag = computed(() => {
  const data = tags.value.map(tag => ({
    name: tag.name,
    value: bookmarks.value.filter(b => b.tags.includes(tag.id)).length
  }))
  return data.filter(d => d.value > 0)
})

const formatDate = (date: string) => {
  const d = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return d.toLocaleDateString()
}

const initFolderChart = () => {
  if (!folderChartRef.value) return

  folderChart = echarts.init(folderChartRef.value)
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        data: bookmarksByFolder.value,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  folderChart.setOption(option)
}

const initTagChart = () => {
  if (!tagChartRef.value) return

  tagChart = echarts.init(tagChartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: bookmarksByTag.value.map(d => d.name),
      axisLabel: {
        interval: 0,
        rotate: 30
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: bookmarksByTag.value.map(d => d.value),
        type: 'bar',
        itemStyle: {
          color: '#3B82F6'
        }
      }
    ]
  }
  tagChart.setOption(option)
}

const updateCharts = () => {
  if (folderChart) {
    folderChart.setOption({
      series: [{ data: bookmarksByFolder.value }]
    })
  }
  if (tagChart) {
    tagChart.setOption({
      xAxis: { data: bookmarksByTag.value.map(d => d.name) },
      series: [{ data: bookmarksByTag.value.map(d => d.value) }]
    })
  }
}

onMounted(() => {
  initFolderChart()
  initTagChart()
})

watch([bookmarksByFolder, bookmarksByTag], () => {
  updateCharts()
})
</script>

<style scoped>
.stats-view {
  flex: 1;
  overflow-y: auto;
}

.stats-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0 0 24px 0;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.stat-icon.total {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.stat-icon.folders {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.stat-icon.tags {
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.stat-icon.visits {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
}

.stats-charts {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.chart-section {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0 0 16px 0;
}

.chart-container {
  height: 300px;
}

.stats-lists {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.list-section {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.list-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: var(--el-fill-color-light);
  border-radius: 8px;
  transition: background-color 0.2s;
}

.list-item:hover {
  background-color: var(--el-fill-color);
}

.list-item-content {
  flex: 1;
  min-width: 0;
}

.list-item-title {
  font-weight: 500;
  color: var(--el-text-color-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-item-url {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-item-count {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--el-color-primary);
  font-weight: 500;
}

.list-item-date {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  white-space: nowrap;
}

.empty-list {
  text-align: center;
  padding: 24px;
  color: var(--el-text-color-secondary);
}

@media (max-width: 1200px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .stats-charts {
    grid-template-columns: 1fr;
  }

  .stats-lists {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }

  .stats-title {
    font-size: 24px;
  }

  .stat-value {
    font-size: 24px;
  }
}
</style>
