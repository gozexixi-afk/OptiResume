<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
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

const pageHeightPx = ref(1123)
const contentHeight = ref(0)
let resizeObserver: ResizeObserver | null = null

const pageCount = computed(() => {
  if (!contentHeight.value || !pageHeightPx.value) return 1
  return Math.max(1, Math.ceil(contentHeight.value / pageHeightPx.value))
})

const pageBreakPositions = computed(() => {
  const breaks: number[] = []
  for (let i = 1; i < pageCount.value; i++) {
    breaks.push(i * pageHeightPx.value)
  }
  return breaks
})

onMounted(() => {
  const measure = document.createElement('div')
  measure.style.cssText = 'position:absolute;visibility:hidden;width:210mm;height:297mm;pointer-events:none'
  document.body.appendChild(measure)
  pageHeightPx.value = measure.getBoundingClientRect().height
  document.body.removeChild(measure)

  nextTick(() => {
    if (resumeEl.value) {
      resizeObserver = new ResizeObserver(entries => {
        contentHeight.value = entries[0].contentRect.height
      })
      resizeObserver.observe(resumeEl.value)
    }
  })
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})

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
    <div class="page-indicator" v-if="pageCount > 1">
      <el-icon><Document /></el-icon>
      <span>{{ t('preview.pageCount', { count: pageCount }) }}</span>
    </div>
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
    <div class="resume-wrapper" :style="scaleStyle">
      <div ref="resumeEl" class="resume-page">
        <component :is="currentComponent" />
      </div>
      <div
        v-for="(pos, i) in pageBreakPositions"
        :key="i"
        class="page-break-marker"
        :style="{ top: pos + 'px' }"
      >
        <div class="page-break-line" />
        <span class="page-break-label">{{ t('preview.pageN', { n: i + 2 }) }}</span>
      </div>
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

.page-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--el-color-warning);
  background: var(--el-color-warning-light-9);
  padding: 2px 10px;
  border-radius: 12px;
  white-space: nowrap;
  margin-left: auto;
  margin-right: 8px;
}

.resume-wrapper {
  position: relative;
  width: 210mm;
  transition: transform 0.2s ease;
}

.resume-page {
  width: 210mm;
  min-height: 297mm;
  background: #ffffff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

.page-break-marker {
  position: absolute;
  left: 0;
  right: 0;
  height: 0;
  z-index: 10;
  pointer-events: none;
}

.page-break-line {
  position: absolute;
  left: -12px;
  right: -12px;
  top: -1px;
  border-top: 2px dashed rgba(231, 76, 60, 0.5);
}

.page-break-label {
  position: absolute;
  top: -10px;
  right: -12px;
  background: rgba(231, 76, 60, 0.85);
  color: #fff;
  font-size: 10px;
  padding: 1px 8px;
  border-radius: 0 0 4px 4px;
  letter-spacing: 0.5px;
  font-weight: 600;
}
</style>
