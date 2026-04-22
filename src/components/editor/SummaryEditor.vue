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
          <el-icon><Document /></el-icon>
          {{ t('summary.title') }}
        </span>
        <div class="section-extra">
          <el-icon><EditPen /></el-icon>
        </div>
      </div>
    </template>
    <RichTextEditor v-model="store.data.summary" :placeholder="t('summary.placeholder')" />
  </el-card>
</template>

<style scoped lang="scss">
.section-extra {
  position: absolute;
  right: 0;
  color: var(--el-text-color-secondary);
}
</style>
