import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { AppSettings, TemplateType, AIConfig, AIProvider, LayoutSettings } from '@/types/resume'

const SETTINGS_KEY = 'optiresume-settings'
const AI_KEY = 'optiresume-ai'

const DEFAULT_LAYOUT: LayoutSettings = {
  fontFamily: 'PingFang SC',
  fontSize: 13,
  lineHeight: 1.5,
  themeColor: '#111111',
  headerAlign: 'left',
  infoDisplay: 'icon',
  pagePaddingTop: 28,
  pagePaddingRight: 34,
  pagePaddingBottom: 28,
  pagePaddingLeft: 34,
  sectionSpacing: 12,
  titleMarginTop: 0,
  titleMarginBottom: 6
}

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppSettings>
      return {
        locale: parsed.locale ?? 'zh-CN',
        theme: parsed.theme ?? 'light',
        template: parsed.template ?? 'classic',
        previewScale: parsed.previewScale ?? 100,
        editorCollapsed: parsed.editorCollapsed ?? false,
        layout: { ...DEFAULT_LAYOUT, ...(parsed.layout || {}) }
      }
    }
  } catch { /* ignore */ }
  return {
    locale: 'zh-CN',
    theme: 'light',
    template: 'classic',
    previewScale: 100,
    editorCollapsed: false,
    layout: { ...DEFAULT_LAYOUT }
  }
}

function loadAIConfig(): AIConfig {
  try {
    const raw = localStorage.getItem(AI_KEY)
    if (raw) {
      const cfg = JSON.parse(raw) as AIConfig
      // 旧版 deepseek-coder 已不在官方 V3.2 模型列表中，见 api-docs.deepseek.com
      if (cfg.provider === 'deepseek' && cfg.model === 'deepseek-coder') {
        cfg.model = 'deepseek-chat'
      }
      return cfg
    }
  } catch { /* ignore */ }
  return {
    provider: 'deepseek',
    model: 'deepseek-chat',
    apiKey: '',
    apiEndpoint: ''
  }
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<AppSettings>(loadSettings())
  const aiConfig = ref<AIConfig>(loadAIConfig())

  watch(settings, (val) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(val))
  }, { deep: true })

  watch(aiConfig, (val) => {
    localStorage.setItem(AI_KEY, JSON.stringify(val))
  }, { deep: true })

  function setLocale(locale: 'zh-CN' | 'en-US') {
    settings.value.locale = locale
  }

  function toggleTheme() {
    settings.value.theme = settings.value.theme === 'light' ? 'dark' : 'light'
  }

  function setTemplate(template: TemplateType) {
    settings.value.template = template
  }

  function setPreviewScale(scale: number) {
    settings.value.previewScale = scale
  }

  function toggleEditor() {
    settings.value.editorCollapsed = !settings.value.editorCollapsed
  }

  function updateLayout(partial: Partial<LayoutSettings>) {
    settings.value.layout = {
      ...settings.value.layout,
      ...partial
    }
  }

  function resetLayout() {
    settings.value.layout = { ...DEFAULT_LAYOUT }
  }

  function setAIProvider(provider: AIProvider) {
    aiConfig.value.provider = provider
  }

  function setAIModel(model: string) {
    aiConfig.value.model = model
  }

  return {
    settings, aiConfig,
    setLocale, toggleTheme, setTemplate,
    setPreviewScale, toggleEditor,
    updateLayout, resetLayout,
    setAIProvider, setAIModel
  }
})
