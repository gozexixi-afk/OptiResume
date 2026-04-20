<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/stores/settings'
import { useResumeStore } from '@/stores/resume'
import type { TemplateType, ResumeSectionKey } from '@/types/resume'
import ClassicTemplate from '@/components/templates/ClassicTemplate.vue'
import ModernTemplate from '@/components/templates/ModernTemplate.vue'
import MinimalTemplate from '@/components/templates/MinimalTemplate.vue'
import SmartOptimizePanel from '@/components/common/SmartOptimizePanel.vue'

const { t } = useI18n()
const settingsStore = useSettingsStore()
const resumeStore = useResumeStore()
const resumeEl = ref<HTMLElement>()
const activeModule = ref<'layout' | 'smart'>('layout')

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

const resumePageStyle = computed(() => ({
  '--or-resume-font-family': settingsStore.settings.layout.fontFamily,
  '--or-resume-font-size': `${settingsStore.settings.layout.fontSize}px`,
  '--or-resume-line-height': settingsStore.settings.layout.lineHeight,
  '--or-theme-color': settingsStore.settings.layout.themeColor,
  '--or-page-padding-top': `${settingsStore.settings.layout.pagePaddingTop}px`,
  '--or-page-padding-right': `${settingsStore.settings.layout.pagePaddingRight}px`,
  '--or-page-padding-bottom': `${settingsStore.settings.layout.pagePaddingBottom}px`,
  '--or-page-padding-left': `${settingsStore.settings.layout.pagePaddingLeft}px`,
  '--or-section-spacing': `${settingsStore.settings.layout.sectionSpacing}px`,
  '--or-title-margin-top': `${settingsStore.settings.layout.titleMarginTop}px`,
  '--or-title-margin-bottom': `${settingsStore.settings.layout.titleMarginBottom}px`,
  '--or-header-align': settingsStore.settings.layout.headerAlign
}))

const sectionOptions = computed(() => {
  const keys: ResumeSectionKey[] = ['personal', 'objective', 'summary', 'experience', 'education', 'skills', 'projects', 'languages', 'customSections']
  return keys.map(key => ({ key, label: t(`${key === 'customSections' ? 'customSection' : key}.title`) }))
})

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
    <div class="module-tabs">
      <el-button :type="activeModule === 'layout' ? 'primary' : 'default'" @click="activeModule = 'layout'">基础布局</el-button>
      <el-button :type="activeModule === 'smart' ? 'primary' : 'default'" @click="activeModule = 'smart'">智能优化</el-button>
    </div>

    <template v-if="activeModule === 'layout'">
      <el-select
        :model-value="settingsStore.settings.layout.fontFamily"
        @update:model-value="settingsStore.updateLayout({ fontFamily: $event })"
        class="mini-select"
      >
        <el-option label="思源黑体" value="'Source Han Sans CN', 'Noto Sans SC', sans-serif" />
        <el-option label="苹方" value="'PingFang SC', 'Microsoft YaHei', sans-serif" />
        <el-option label="微软雅黑" value="'Microsoft YaHei', sans-serif" />
        <el-option label="Arial" value="Arial, sans-serif" />
      </el-select>

      <el-select
        :model-value="settingsStore.settings.layout.fontSize"
        @update:model-value="settingsStore.updateLayout({ fontSize: Number($event) })"
        class="mini-select size-select"
      >
        <el-option v-for="n in [11, 12, 13, 14, 15, 16]" :key="n" :label="`${n}`" :value="n" />
      </el-select>

      <el-select
        :model-value="settingsStore.settings.layout.lineHeight"
        @update:model-value="settingsStore.updateLayout({ lineHeight: Number($event) })"
        class="mini-select size-select"
      >
        <el-option v-for="n in [1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 2.0]" :key="n" :label="`${n}`" :value="n" />
      </el-select>

      <el-color-picker
        :model-value="settingsStore.settings.layout.themeColor"
        @update:model-value="settingsStore.updateLayout({ themeColor: $event || '#111111' })"
        size="small"
      />

      <el-popover trigger="click" placement="bottom-start" :width="320">
        <template #reference>
          <el-button>模板风格</el-button>
        </template>
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
      </el-popover>

      <el-popover trigger="click" placement="bottom-start" :width="330">
        <template #reference>
          <el-button>添加模块</el-button>
        </template>
        <div class="section-picker">
          <el-checkbox
            v-for="option in sectionOptions"
            :key="option.key"
            :model-value="resumeStore.hasSection(option.key)"
            @change="(checked: boolean) => checked ? resumeStore.restoreSection(option.key) : resumeStore.removeSection(option.key)"
          >
            {{ option.label }}
          </el-checkbox>
        </div>
      </el-popover>

      <el-popover trigger="click" placement="bottom-end" :width="360">
        <template #reference>
          <el-button>间距配置</el-button>
        </template>
        <div class="spacing-panel">
          <div class="spacing-item">
            <span>页面上边距：</span>
            <el-slider :min="10" :max="80" :model-value="settingsStore.settings.layout.pagePaddingTop" @update:model-value="settingsStore.updateLayout({ pagePaddingTop: Number($event) })" />
          </div>
          <div class="spacing-item">
            <span>页面左边距：</span>
            <el-slider :min="10" :max="80" :model-value="settingsStore.settings.layout.pagePaddingLeft" @update:model-value="settingsStore.updateLayout({ pagePaddingLeft: Number($event) })" />
          </div>
          <div class="spacing-item">
            <span>页面右边距：</span>
            <el-slider :min="10" :max="80" :model-value="settingsStore.settings.layout.pagePaddingRight" @update:model-value="settingsStore.updateLayout({ pagePaddingRight: Number($event) })" />
          </div>
          <div class="spacing-item">
            <span>模块上边距：</span>
            <el-slider :min="0" :max="30" :model-value="settingsStore.settings.layout.sectionSpacing" @update:model-value="settingsStore.updateLayout({ sectionSpacing: Number($event) })" />
          </div>
          <div class="spacing-item">
            <span>标题上边距：</span>
            <el-slider :min="0" :max="20" :model-value="settingsStore.settings.layout.titleMarginTop" @update:model-value="settingsStore.updateLayout({ titleMarginTop: Number($event) })" />
          </div>
          <div class="spacing-item">
            <span>标题下边距：</span>
            <el-slider :min="0" :max="20" :model-value="settingsStore.settings.layout.titleMarginBottom" @update:model-value="settingsStore.updateLayout({ titleMarginBottom: Number($event) })" />
          </div>
          <el-button size="small" @click="settingsStore.resetLayout">重置</el-button>
        </div>
      </el-popover>
    </template>

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
  <SmartOptimizePanel v-if="activeModule === 'smart'" />
  <div class="preview-content">
    <div class="resume-wrapper" :style="scaleStyle">
      <div ref="resumeEl" class="resume-page" :style="resumePageStyle">
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

.module-tabs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mini-select {
  width: 130px;
}

.size-select {
  width: 75px;
}

.section-picker {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.spacing-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.spacing-item {
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    width: 92px;
    font-size: 13px;
    color: var(--el-text-color-primary);
    flex-shrink: 0;
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
  color: var(--or-theme-color, #111111);
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
