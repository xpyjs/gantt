<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑任务' : '新建任务'"
    width="560px"
    :close-on-click-modal="false"
    class="task-dialog"
    @closed="handleClosed"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="80px"
      label-position="left"
    >
      <el-form-item label="任务名称" prop="name">
        <el-input
          v-model="formData.name"
          placeholder="请输入任务名称"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="开始时间" prop="startTime">
            <el-date-picker
              v-model="formData.startTime"
              type="datetime"
              placeholder="选择开始时间"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker
              v-model="formData.endTime"
              type="datetime"
              placeholder="选择结束时间"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="任务类型" prop="type">
            <el-select v-model="formData.type" placeholder="选择类型" style="width: 100%">
              <el-option label="普通任务" value="normal" />
              <el-option label="里程碑" value="milestone" />
              <el-option label="汇总任务" value="summary" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="任务状态" prop="status">
            <el-select v-model="formData.status" placeholder="选择状态" style="width: 100%">
              <el-option
                v-for="opt in statusOptions"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              >
                <el-tag :type="opt.type" size="small" style="margin-right: 8px" :style="opt.type === 'primary' ? '--el-tag-text-color: #409eff; --el-tag-border-color: #b4d8fd; --el-tag-bg-color: #eef6fd' : ''">
                  {{ opt.label }}
                </el-tag>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="负责人" prop="assignee">
            <el-select
              v-model="formData.assignee"
              placeholder="选择负责人"
              filterable
              style="width: 100%"
            >
              <el-option
                v-for="member in teamMembers"
                :key="member.id"
                :label="member.name"
                :value="member.name"
              >
                <div class="member-option">
                  <el-avatar :size="24" :style="{ background: member.color }">
                    {{ member.name.charAt(0) }}
                  </el-avatar>
                  <span>{{ member.name }}</span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="优先级" prop="priority">
            <el-select v-model="formData.priority" placeholder="选择优先级" style="width: 100%">
              <el-option
                v-for="opt in priorityOptions"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              >
                <el-tag :color="opt.color" size="small" effect="dark">
                  {{ opt.label }}
                </el-tag>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="进度" prop="progress" v-if="formData.type !== 'milestone'">
        <el-slider
          v-model="formData.progress"
          :marks="{ 0: '0%', 50: '50%', 100: '100%' }"
          :step="5"
        />
      </el-form-item>

      <el-form-item label="任务描述" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          placeholder="请输入任务描述（可选）"
          :rows="3"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          {{ isEdit ? '保存' : '创建' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { dayjs } from '@xpyjs/gantt-vue'
import { teamMembers, priorityOptions, statusOptions } from '../data'
import type { TaskData } from '../types'

interface Props {
  modelValue: boolean
  task?: TaskData | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [val: boolean]
  'submit': [data: Partial<TaskData>]
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const isEdit = computed(() => !!props.task)
const formRef = ref<FormInstance>()
const submitting = ref(false)

const initialFormData = (): Partial<TaskData> => ({
  name: '',
  startTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  endTime: dayjs().add(3, 'day').format('YYYY-MM-DD HH:mm:ss'),
  type: 'task',
  status: 'pending',
  progress: 0,
  assignee: '',
  priority: 'medium',
  description: ''
})

const formData = reactive<Partial<TaskData>>(initialFormData())

const formRules: FormRules = {
  name: [
    { required: true, message: '请输入任务名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  startTime: [
    { required: true, message: '请选择开始时间', trigger: 'change' }
  ],
  endTime: [
    { required: true, message: '请选择结束时间', trigger: 'change' },
    {
      validator: (_rule, value, callback) => {
        if (value && formData.startTime) {
          if (dayjs(value).isBefore(dayjs(formData.startTime))) {
            callback(new Error('结束时间不能早于开始时间'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  type: [
    { required: true, message: '请选择任务类型', trigger: 'change' }
  ]
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      if (props.task) {
        Object.assign(formData, props.task)
      } else {
        Object.assign(formData, initialFormData())
      }
    }
  }
)

function handleClosed() {
  formRef.value?.resetFields()
  Object.assign(formData, initialFormData())
}

async function handleSubmit() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    submitting.value = true

    // 模拟提交延迟
    await new Promise(resolve => setTimeout(resolve, 300))

    emit('submit', { ...formData })
    visible.value = false
  } catch (e) {
    // 验证失败
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped lang="scss">
.task-dialog {
  :deep(.el-dialog__header) {
    padding: 20px 24px;
    margin: 0;
    border-bottom: 1px solid var(--border-color);
  }

  :deep(.el-dialog__body) {
    padding: 24px;
  }

  :deep(.el-dialog__footer) {
    padding: 16px 24px;
    border-top: 1px solid var(--border-color);
  }
}

.member-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

:deep(.el-slider__marks-text) {
  font-size: 12px;
}
</style>
