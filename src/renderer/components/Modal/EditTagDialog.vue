<template>
  <el-dialog
    v-model="dialogVisible"
    title="Edit Tag"
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
          placeholder="Enter tag name"
          @keyup.enter="handleSubmit"
        />
      </el-form-item>
      <el-form-item label="Color" prop="color">
        <div class="color-picker-wrapper">
          <el-color-picker
            v-model="form.color"
            show-alpha
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
import { useTagStore } from '../../stores'
import { ElMessage } from 'element-plus'

interface Props {
  modelValue: boolean
  tag: any
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'updated', tag: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const tagStore = useTagStore()
const { updateTag } = tagStore

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
    { required: true, message: 'Please enter tag name', trigger: 'blur' },
    { min:1, max: 30, message: 'Name should be 1-30 characters', trigger: 'blur' }
  ],
  color: [
    { required: true, message: 'Please select color', trigger: 'blur' }
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

    await updateTag(form.value.id, updates)

    emit('updated', updates)

    ElMessage.success('Tag updated successfully')
    handleClose()
  } catch {
    // Validation failed
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

watch(() => props.tag, (newTag) => {
  if (newTag) {
    form.value = {
      name: newTag.name,
      color: newTag.color || '#3B82F6',
      id: newTag.id
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
