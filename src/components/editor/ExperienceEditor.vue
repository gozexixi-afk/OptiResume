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
          <el-icon><Briefcase /></el-icon>
          {{ t('experience.title') }}
        </span>
        <el-button type="primary" size="small" @click="store.addExperience">
          <el-icon><Plus /></el-icon>
          {{ t('experience.add') }}
        </el-button>
      </div>
    </template>

    <el-empty v-if="store.data.experience.length === 0" :description="t('experience.empty')" />

    <div
      v-for="(exp, index) in store.data.experience"
      :key="exp.id"
      class="item-card"
    >
      <div class="item-actions">
        <el-button
          size="small" circle text
          :disabled="index === 0"
          @click="store.moveExperience(index, index - 1)"
        >
          <el-icon><Top /></el-icon>
        </el-button>
        <el-button
          size="small" circle text
          :disabled="index === store.data.experience.length - 1"
          @click="store.moveExperience(index, index + 1)"
        >
          <el-icon><Bottom /></el-icon>
        </el-button>
        <el-button size="small" circle text type="danger" @click="store.removeExperience(exp.id)">
          <el-icon><Delete /></el-icon>
        </el-button>
      </div>

      <el-form label-position="top" size="default">
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item :label="t('experience.company')">
              <el-input v-model="exp.company" :placeholder="t('experience.companyPlaceholder')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('experience.position')">
              <el-input v-model="exp.position" :placeholder="t('experience.positionPlaceholder')" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="12">
          <el-col :span="8">
            <el-form-item :label="t('experience.startDate')">
              <el-date-picker
                v-model="exp.startDate"
                type="month"
                format="YYYY-MM"
                value-format="YYYY-MM"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="t('experience.endDate')">
              <el-date-picker
                v-model="exp.endDate"
                type="month"
                format="YYYY-MM"
                value-format="YYYY-MM"
                :disabled="exp.isCurrent"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="' '">
              <el-checkbox v-model="exp.isCurrent">{{ t('experience.isCurrent') }}</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item :label="t('experience.description')">
          <el-input
            v-model="exp.description"
            type="textarea"
            :rows="3"
            :placeholder="t('experience.descriptionPlaceholder')"
          />
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>
