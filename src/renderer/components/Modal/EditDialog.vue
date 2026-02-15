<template>
  <el-dialog
    v-model="dialogVisible"
    :title="t('dialog.editBookmark')"
    width="500px"
  >
    <el-form
      ref="formRef"
      :model="form"
      label-width="80px"
    >
      <el-form-item :label="t('form.title')">
        <el-input v-model="form.title" />
      </el-form-item>

      <el-form-item :label="t('form.description')">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
        />
      </el-form-item>

      <el-form-item :label="t('form.folder')">
        <el-select
          v-model="form.folderId"
          style="width: 100%"
        >
          <el-option
            v-for="folder in folders"
            :key="folder.id"
            :label="folder.name"
            :value="folder.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('form.tags')">
        <el-select
          v-model="form.tags"
          multiple
          style="width: 100%"
        >
          <el-option
            v-for="tag in tags"
            :key="tag.id"
            :label="tag.name"
            :value="tag.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('form.color')">
        <el-color-picker v-model="form.color" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">
        {{ t('common.cancel') }}
      </el-button>
      <el-button
        type="primary"
        @click="handleSubmit"
      >
        {{ t('common.save') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FormInstance } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useBookmarkStore, useFolderStore, useTagStore } from '../../stores'

const { t } = useI18n()

interface Props {
  modelValue: boolean
  bookmark: any
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const bookmarkStore = useBookmarkStore()
const folderStore = useFolderStore()
const tagStore = useTagStore()
const { folders } = storeToRefs(folderStore)
const { tags } = storeToRefs(tagStore)

const dialogVisible = ref(false)
const formRef = ref<FormInstance>()
const form = ref({
  title: '',
  description: '',
  folderId: '',
  tags: [] as string[],
  color: '#3B82F6'
})

const handleSubmit = () => {
  if (!formRef.value) return

  formRef.value.validate().then(() => {
    bookmarkStore.updateBookmark(props.bookmark.id, form.value)
    handleClose()
  })
}

const handleClose = () => {
  dialogVisible.value = false
  emit('update:modelValue', false)
}

watch(
  () => props.modelValue,
  newVal => {
    dialogVisible.value = newVal

    if (newVal && props.bookmark) {
      form.value = {
        title: props.bookmark.title || '',
        description: props.bookmark.description || '',
        folderId: props.bookmark.folderId || '',
        tags: props.bookmark.tags || [],
        color: props.bookmark.color || '#3B82F6'
      }
    }
  }
)
</script>
