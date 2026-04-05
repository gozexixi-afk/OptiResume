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
          <el-icon><Aim /></el-icon>
          {{ t('objective.title') }}
        </span>
      </div>
    </template>
    <el-input
      v-model="store.data.objective"
      type="textarea"
      :rows="3"
      :placeholder="t('objective.placeholder')"
    />
  </el-card>
</template>
