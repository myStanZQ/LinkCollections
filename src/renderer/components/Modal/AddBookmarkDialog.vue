<template>
  <el-dialog v-model="dialogVisible" title="Add Bookmark" width="500px" @close="handleClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="URL" prop="url">
        <el-input v-model="form.url" placeholder="https://example.com" @blur="fetchUrlMetadata">
          <template #append>
            <el-button @click="fetchUrlMetadata" :loading="fetching">
              <i class="i-heroicons-arrow-path" />
            </el-button>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="Title" prop="title">
        <el-input v-model="form.title" placeholder="Bookmark title" />
      </el-form-item>

      <el-form-item label="Description" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
          placeholder="Brief description"
        />
      </el-form-item>

      <el-form-item label="Folder" prop="folderId">
        <el-select v-model="form.folderId" placeholder="Select folder" style="width: 100%">
          <el-option
            v-for="folder in folders"
            :key="folder.id"
            :label="folder.name"
            :value="folder.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Tags" prop="tags">
        <el-select v-model="form.tags" multiple placeholder="Select tags" style="width: 100%">
          <el-option v-for="tag in tags" :key="tag.id" :label="tag.name" :value="tag.id">
            <div class="tag-option">
              <div class="tag-dot" :style="{ backgroundColor: tag.color }" />
              <span>{{ tag.name }}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="Color" prop="color">
        <div class="color-picker-wrapper">
          <el-color-picker v-model="form.color" :predefine="predefineColors" />
          <el-input
            v-model="form.color"
            placeholder="#3B82F6"
            style="width: 120px; margin-left: 12px"
          />
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">Cancel</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitting">
        Add Bookmark
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import type { FormInstance, FormRules } from 'element-plus'
import { useBookmarkStore, useFolderStore, useTagStore, useUIStore } from '../../stores'
import { validateBookmarkData } from '../../utils/validation'
import { getFaviconUrl, shouldFetchFavicon } from '../../utils/favicon'

interface Props {
  modelValue: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const bookmarkStore = useBookmarkStore()
const folderStore = useFolderStore()
const tagStore = useTagStore()
const uiStore = useUIStore()
const { folders } = storeToRefs(folderStore)
const { tags } = storeToRefs(tagStore)
const { settings } = storeToRefs(uiStore)
const { addBookmark } = bookmarkStore

const dialogVisible = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})

const formRef = ref<FormInstance>()
const fetching = ref(false)
const submitting = ref(false)

const form = ref({
  url: '',
  title: '',
  description: '',
  folderId: '',
  tags: [] as string[],
  color: '#3B82F6'
})

const predefineColors = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#EC4899',
  '#6366F1',
  '#14B8A6'
]

const rules: FormRules = {
  url: [
    { required: true, message: 'Please enter URL', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (!value) {
          callback()
          return
        }
        try {
          new URL(value.startsWith('http') ? value : `https://${value}`)
          callback()
        } catch {
          callback(new Error('Please enter a valid URL'))
        }
      },
      trigger: 'blur'
    }
  ],
  title: [{ required: true, message: 'Please enter title', trigger: 'blur' }],
  folderId: [{ required: true, message: 'Please select folder', trigger: 'change' }]
}

const fetchUrlMetadata = async () => {
  if (!form.value.url) return

  try {
    fetching.value = true
    const urlStr = form.value.url.startsWith('http') ? form.value.url : `https://${form.value.url}`
    const url = new URL(urlStr)

    if (!form.value.title) {
      form.value.title = url.hostname
    }

    const shouldFetch = settings.value?.autoFetchIcon ?? true
    if (shouldFetch && shouldFetchFavicon(urlStr)) {
    }
  } catch (error) {
  } finally {
    fetching.value = false
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    const validation = validateBookmarkData(form.value)
    if (!validation.valid) {
      return
    }

    const shouldFetch = settings.value?.autoFetchIcon ?? true
    let favicon = ''

    if (shouldFetch && shouldFetchFavicon(form.value.url)) {
      favicon = getFaviconUrl(form.value.url)
    }

    submitting.value = true
    await addBookmark({
      ...form.value,
      favicon
    })
    handleClose()
  } catch (error) {
    // Validation failed or API error
  } finally {
    submitting.value = false
  }
}

const handleClose = () => {
  form.value = {
    url: '',
    title: '',
    description: '',
    folderId: '',
    tags: [],
    color: '#3B82F6'
  }
  formRef.value?.resetFields()
  dialogVisible.value = false
}

watch(
  () => props.modelValue,
  async visible => {
    if (visible) {
      await folderStore.fetchFolders()
      await tagStore.fetchTags()
      if (folders.value.length > 0 && !form.value.folderId) {
        form.value.folderId = folders.value[0].id
      }
    }
  }
)
</script>

<style scoped>
.color-picker-wrapper {
  display: flex;
  align-items: center;
}

.tag-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tag-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
</style>
