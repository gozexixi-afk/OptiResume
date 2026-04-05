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
          <el-icon><Grid /></el-icon>
          {{ t('customSection.title') }}
        </span>
        <el-button type="primary" size="small" @click="store.addCustomSection">
          <el-icon><Plus /></el-icon>
          {{ t('customSection.add') }}
        </el-button>
      </div>
    </template>

    <el-empty v-if="store.data.customSections.length === 0" :description="t('customSection.empty')" />

    <div
      v-for="section in store.data.customSections"
      :key="section.id"
      class="item-card"
    >
      <div class="item-actions">
        <el-button size="small" circle text type="danger" @click="store.removeCustomSection(section.id)">
          <el-icon><Delete /></el-icon>
        </el-button>
      </div>

      <el-form label-position="top" size="default">
        <el-form-item :label="t('customSection.sectionTitle')">
          <el-input v-model="section.title" :placeholder="t('customSection.sectionTitlePlaceholder')" />
        </el-form-item>

        <el-form-item :label="t('customSection.content')">
          <el-input
            v-model="section.content"
            type="textarea"
            :rows="4"
            :placeholder="t('customSection.contentPlaceholder')"
          />
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>
