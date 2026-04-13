<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SectionManager from './SectionManager.vue'

const { t } = useI18n()
</script>

<template>
  <div class="editor-panel-inner">
    <h3 class="editor-title">
      <el-icon><EditPen /></el-icon>
      {{ t('editor.title') }}
    </h3>
    <SectionManager />
  </div>
</template>

<style scoped lang="scss">
.editor-panel-inner {
  max-width: 600px;
  margin: 0 auto;
}

.editor-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  margin-bottom: 16px;
  color: var(--el-text-color-primary);
}
</style>
