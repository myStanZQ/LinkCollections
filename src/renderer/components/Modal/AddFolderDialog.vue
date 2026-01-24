<template>
  <el-dialog
    v-model="dialogVisible"
    title="Add Folder"
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
        Add Folder
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useFolderStore } from '../../stores'

interface Props {
  modelValue: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const folderStore = useFolderStore()
const { addFolder } = folderStore

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const formRef = ref<FormInstance>()
const form = ref({
  name: '',
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
  name: [
    { required: true, message: 'Please enter folder name', trigger: 'blur' },
    { min: 1, max: 50, message: 'Name should be 1-50 characters', trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    await addFolder({ name: form.value.name, color: form.value.color })
    handleClose()
  } catch {
    // Validation failed
  }
}

const handleClose = () => {
  form.value.name = ''
  form.value.color = '#3B82F6'
  formRef.value?.resetFields()
  dialogVisible.value = false
}

  watch(() => props.modelValue, (visible) => {
    if (visible) {
      setTimeout(() => {
        const input = document.querySelector('.el-input__inner') as HTMLInputElement
        input?.focus()
      }, 100)
    }
  })
</script>

<style scoped>
.color-picker-wrapper {
  display: flex;
  align-items: center;
}
</style>
