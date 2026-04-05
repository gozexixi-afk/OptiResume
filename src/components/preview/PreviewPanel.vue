<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/stores/settings'
import type { TemplateType } from '@/types/resume'
import ClassicTemplate from '@/components/templates/ClassicTemplate.vue'
import ModernTemplate from '@/components/templates/ModernTemplate.vue'
import MinimalTemplate from '@/components/templates/MinimalTemplate.vue'

const { t } = useI18n()
const settingsStore = useSettingsStore()
const resumeEl = ref<HTMLElement>()

const templateComponents = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate
} as const

const currentComponent = computed(() => templateComponents[settingsStore.settings.template])

const scaleStyle = computed(() => ({
  transform: `scale(${settingsStore.settings.previewScale / 100})`,
  transformOrigin: 'top center'
}))

function getResumeElement(): HTMLElement | undefined {
  return resumeEl.value
}

defineExpose({ getResumeElement })
</script>

<template>
  <div class="preview-toolbar">
    <el-tabs
      :model-value="settingsStore.settings.template"
      @update:model-value="settingsStore.setTemplate($event as TemplateType)"
      class="template-tabs"
    >
      <el-tab-pane
        v-for="tpl in (['classic', 'modern', 'minimal'] as const)"
        :key="tpl"
        :name="tpl"
        :label="t(`preview.templates.${tpl}`)"
      />
    </el-tabs>
    <div class="scale-control">
      <el-icon><ZoomIn /></el-icon>
      <el-slider
        :model-value="settingsStore.settings.previewScale"
        @update:model-value="settingsStore.setPreviewScale($event)"
        :min="50"
        :max="150"
        :step="5"
        :show-tooltip="true"
        style="width: 120px;"
      />
      <span class="scale-label">{{ settingsStore.settings.previewScale }}%</span>
    </div>
  </div>
  <div class="preview-content">
    <div ref="resumeEl" class="resume-page" :style="scaleStyle">
      <component :is="currentComponent" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.template-tabs {
  :deep(.el-tabs__header) {
    margin: 0;
  }
}

.scale-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  min-width: 36px;
}

.resume-page {
  width: 210mm;
  min-height: 297mm;
  background: #ffffff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease;
}
</style>
