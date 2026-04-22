<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useResumeStore } from '@/stores/resume'
import RichTextEditor from '@/components/common/RichTextEditor.vue'

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
        <div class="section-extra">
          <el-icon><EditPen /></el-icon>
        </div>
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
          <RichTextEditor v-model="section.content" :placeholder="t('customSection.contentPlaceholder')" />
        </el-form-item>
      </el-form>
    </div>
    <el-button type="primary" @click="store.addCustomSection">
      <el-icon><Plus /></el-icon>
      {{ t('customSection.add') }}
    </el-button>
  </el-card>
</template>

<style scoped lang="scss">
.section-extra {
  position: absolute;
  right: 0;
  color: var(--el-text-color-secondary);
}
</style>
