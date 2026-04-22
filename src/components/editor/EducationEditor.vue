<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useResumeStore } from '@/stores/resume'
import RichTextEditor from '@/components/common/RichTextEditor.vue'

const { t } = useI18n()
const store = useResumeStore()
</script>

<template>
  <el-card class="section-card" shadow="hover">
    <el-empty v-if="store.data.education.length === 0" :description="t('education.empty')" />

    <div
      v-for="(edu, index) in store.data.education"
      :key="edu.id"
      class="item-card"
    >
      <div class="item-actions">
        <el-button
          size="small" circle text
          :disabled="index === 0"
          @click="store.moveEducation(index, index - 1)"
        >
          <el-icon><Top /></el-icon>
        </el-button>
        <el-button
          size="small" circle text
          :disabled="index === store.data.education.length - 1"
          @click="store.moveEducation(index, index + 1)"
        >
          <el-icon><Bottom /></el-icon>
        </el-button>
        <el-button size="small" circle text type="danger" @click="store.removeEducation(edu.id)">
          <el-icon><Delete /></el-icon>
        </el-button>
      </div>

      <el-form label-position="top" size="default" class="module-form">
        <el-row :gutter="12">
          <el-col :span="8">
            <el-form-item :label="t('education.school')">
              <el-input v-model="edu.school" :placeholder="t('education.schoolPlaceholder')" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="t('education.major')">
              <el-input v-model="edu.major" :placeholder="t('education.majorPlaceholder')" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="t('education.degree')">
              <el-input v-model="edu.degree" :placeholder="t('education.degreePlaceholder')" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="12">
          <el-col :span="16">
            <el-form-item :label="t('education.period')">
              <div class="time-range">
                <el-date-picker
                  v-model="edu.startDate"
                  type="month"
                  format="YYYY-MM"
                  value-format="YYYY-MM"
                  style="width: 100%"
                />
                <span class="dash">-</span>
                <el-date-picker
                  v-model="edu.endDate"
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
            <el-form-item :label="t('education.schoolType')">
              <el-input v-model="edu.schoolType" :placeholder="t('education.schoolTypePlaceholder')" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="t('education.college')">
              <el-input v-model="edu.college" :placeholder="t('education.collegePlaceholder')" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="t('education.city')">
              <el-input v-model="edu.city" :placeholder="t('education.cityPlaceholder')" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item :label="t('education.campusExperience')">
          <RichTextEditor v-model="edu.campusExperience" :placeholder="t('education.campusExperiencePlaceholder')" class="fixed-editor" />
        </el-form-item>
      </el-form>
    </div>
    <div class="module-footer">
      <el-button type="primary" @click="store.addEducation">
        <el-icon><Plus /></el-icon>
        {{ t('education.add') }}
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
