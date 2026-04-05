import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { AppSettings, TemplateType, AIConfig, AIProvider } from '@/types/resume'

const SETTINGS_KEY = 'optiresume-settings'
const AI_KEY = 'optiresume-ai'

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return {
    locale: 'zh-CN',
    theme: 'light',
    template: 'classic',
    previewScale: 100,
    editorCollapsed: false
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
    setAIProvider, setAIModel
  }
})
