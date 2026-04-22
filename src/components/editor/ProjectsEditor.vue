<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useResumeStore } from '@/stores/resume'
import RichTextEditor from '@/components/common/RichTextEditor.vue'

const { t } = useI18n()
const store = useResumeStore()
</script>

<template>
  <el-card class="section-card" shadow="hover">
    <el-empty v-if="store.data.projects.length === 0" :description="t('projects.empty')" />

    <div
      v-for="proj in store.data.projects"
      :key="proj.id"
      class="item-card"
    >
      <div class="item-actions">
        <el-button size="small" circle text type="danger" @click="store.removeProject(proj.id)">
          <el-icon><Delete /></el-icon>
        </el-button>
      </div>

      <el-form label-position="top" size="default" class="module-form">
        <el-row :gutter="12">
          <el-col :span="8">
            <el-form-item :label="t('projects.name')">
              <el-input v-model="proj.name" :placeholder="t('projects.namePlaceholder')" />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item :label="t('projects.period')">
              <div class="time-range">
                <el-date-picker
                  v-model="proj.startDate"
                  type="month"
                  format="YYYY-MM"
                  value-format="YYYY-MM"
                  style="width: 100%"
                />
                <span class="dash">-</span>
                <el-date-picker
                  v-model="proj.endDate"
                  type="month"
                  format="YYYY-MM"
                  value-format="YYYY-MM"
                  style="width: 100%"
                />
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="12">
          <el-col :span="8">
            <el-form-item :label="t('projects.role')">
              <el-input v-model="proj.role" :placeholder="t('projects.rolePlaceholder')" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="t('projects.city')">
              <el-input v-model="proj.city" :placeholder="t('projects.cityPlaceholder')" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="t('projects.link')">
              <el-input v-model="proj.link" :placeholder="t('projects.linkPlaceholder')" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item :label="t('projects.description')">
          <RichTextEditor v-model="proj.description" :placeholder="t('projects.descriptionPlaceholder')" class="fixed-editor" />
        </el-form-item>
      </el-form>
    </div>
    <div class="module-footer">
      <el-button type="primary" @click="store.addProject">
        <el-icon><Plus /></el-icon>
        {{ t('projects.add') }}
      </el-button>
    </div>
  </el-card>
</template>

<style scoped lang="scss">
.time-range {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.dash {
  color: var(--el-text-color-secondary);
}

.module-form {
  padding-top: 2px;
}

.module-footer {
  display: flex;
  justify-content: flex-start;
  padding-top: 4px;
  border-top: 1px dashed var(--el-border-color-lighter);
}

.fixed-editor {
  :deep(.ProseMirror) {
    min-height: 170px;
  }
}
</style>
