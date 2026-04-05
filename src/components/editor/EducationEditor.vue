<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useResumeStore } from '@/stores/resume'

const { t } = useI18n()
const store = useResumeStore()
</script>

<template>
  <el-card class="section-card" shadow="hover">
    <template #header>
      <div class="section-header">
        <span class="section-title">
          <el-icon><School /></el-icon>
          {{ t('education.title') }}
        </span>
        <el-button type="primary" size="small" @click="store.addEducation">
          <el-icon><Plus /></el-icon>
          {{ t('education.add') }}
        </el-button>
      </div>
    </template>

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

      <el-form label-position="top" size="default">
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item :label="t('education.school')">
              <el-input v-model="edu.school" :placeholder="t('education.schoolPlaceholder')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('education.degree')">
              <el-input v-model="edu.degree" :placeholder="t('education.degreePlaceholder')" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item :label="t('education.field')">
          <el-input v-model="edu.field" :placeholder="t('education.fieldPlaceholder')" />
        </el-form-item>

        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item :label="t('education.startDate')">
              <el-date-picker
                v-model="edu.startDate"
                type="month"
                format="YYYY-MM"
                value-format="YYYY-MM"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('education.endDate')">
              <el-date-picker
                v-model="edu.endDate"
                type="month"
                format="YYYY-MM"
                value-format="YYYY-MM"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </el-card>
</template>
