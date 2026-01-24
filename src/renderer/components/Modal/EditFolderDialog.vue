<template>
  <el-dialog
    v-model="dialogVisible"
    title="Edit Folder"
    width="400px"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="Name" prop="name">
        <el-input
          v-model="form.name"
          placeholder="Enter folder name"
          @keyup.enter="handleSubmit"
        />
      </el-form-item>

      <el-form-item label="Color">
        <div class="color-picker-wrapper">
          <el-color-picker
            v-model="form.color"
            :predefine="predefineColors"
          />
          <el-input
            v-model="form.color"
            placeholder="#3B82F6"
            style="width: 120px; margin-left: 12px;"
          />
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">Cancel</el-button>
      <el-button type="primary" @click="handleSubmit">
        Save
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useFolderStore } from '../../stores'
import { ElMessage } from 'element-plus'

interface Props {
  modelValue: boolean
  folder: any
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'updated', updates: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const folderStore = useFolderStore()
const { updateFolder } = folderStore

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const formRef = ref<FormInstance>()
const form = ref({
  name: '',
  color: '#3B82F6',
  id: ''
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
  name: [
    { required: true, message: 'Please enter folder name', trigger: 'blur' },
    { min: 1, max: 50, message: 'Name should be 1-50 characters', trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    const updates = {
      name: form.value.name,
      color: form.value.color
    }

    if (!form.value.id) {
      ElMessage.error('Folder ID is missing')
      return
    }

    await updateFolder(form.value.id, updates)

    emit('updated', updates)

    ElMessage.success('Folder updated successfully')
    handleClose()
  } catch (error) {
    console.error('EditFolderDialog - Error updating folder:', error)
    ElMessage.error('Failed to update folder')
  }
}

const handleClose = () => {
  form.value = {
    name: '',
    color: '#3B82F6',
    id: ''
  }
  formRef.value?.resetFields()
  dialogVisible.value = false
}

watch(() => props.folder, (newFolder) => {
  if (newFolder) {
    form.value = {
      name: newFolder.name,
      color: newFolder.color || '#3B82F6',
      id: newFolder.id
    }
  }
})
</script>

<style scoped>
.color-picker-wrapper {
  display: flex;
  align-items: center;
}
</style>
