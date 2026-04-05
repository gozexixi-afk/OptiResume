<script setup lang="ts">
import { watch, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/stores/settings'
import { useResumeStore } from '@/stores/resume'
import { exportToPDF, exportToHTML, exportToJSON, importFromJSON } from '@/utils/export'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UploadFile } from 'element-plus'
import EditorPanel from '@/components/editor/EditorPanel.vue'
import PreviewPanel from '@/components/preview/PreviewPanel.vue'
import AIAssistant from '@/components/common/AIAssistant.vue'

const { t, locale } = useI18n()
const settingsStore = useSettingsStore()
const resumeStore = useResumeStore()
const showAI = ref(false)
const previewRef = ref<InstanceType<typeof PreviewPanel>>()

watch(() => settingsStore.settings.theme, (theme) => {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}, { immediate: true })

watch(() => settingsStore.settings.locale, (loc) => {
  locale.value = loc
}, { immediate: true })

function switchLocale(lang: 'zh-CN' | 'en-US') {
  settingsStore.setLocale(lang)
}

async function handleExportPDF() {
  const el = previewRef.value?.getResumeElement()
  if (el) {
    await exportToPDF(el)
    ElMessage.success(t('messages.exportSuccess'))
  }
}

function handleExportHTML() {
  const el = previewRef.value?.getResumeElement()
  if (el) {
    exportToHTML(el)
    ElMessage.success(t('messages.exportSuccess'))
  }
}

function handleExportJSON() {
  exportToJSON(resumeStore.data)
  ElMessage.success(t('messages.exportSuccess'))
}

async function handleImportJSON(file: UploadFile) {
  try {
    if (file.raw) {
      const data = await importFromJSON(file.raw)
      resumeStore.importData(data)
      ElMessage.success(t('messages.importSuccess'))
    }
  } catch {
    ElMessage.error(t('messages.importError'))
  }
  return false
}

function handleUndo() {
  if (resumeStore.undo()) {
    ElMessage.success(t('messages.undoSuccess'))
  }
}

function handleReset() {
  ElMessageBox.confirm(t('nav.resetConfirm'), t('nav.reset'), {
    confirmButtonText: t('actions.confirm'),
    cancelButtonText: t('actions.cancel'),
    type: 'warning'
  }).then(() => {
    resumeStore.resetData()
    ElMessage.success(t('messages.resetSuccess'))
  }).catch(() => {})
}
</script>

<template>
  <div class="app-wrapper">
    <header class="app-header">
      <div class="header-left">
        <span class="logo">{{ t('app.logo') }}</span>
      </div>
      <div class="header-right">
        <el-tooltip :content="t('ai.title')">
          <el-button circle @click="showAI = true">
            <el-icon><MagicStick /></el-icon>
          </el-button>
        </el-tooltip>

        <el-tooltip :content="t('nav.undo')">
          <el-button circle :disabled="!resumeStore.canUndo" @click="handleUndo">
            <el-icon><RefreshLeft /></el-icon>
          </el-button>
        </el-tooltip>

        <el-tooltip :content="settingsStore.settings.theme === 'dark' ? t('nav.lightMode') : t('nav.darkMode')">
          <el-button circle @click="settingsStore.toggleTheme">
            <el-icon><component :is="settingsStore.settings.theme === 'dark' ? 'Sunny' : 'Moon'" /></el-icon>
          </el-button>
        </el-tooltip>

        <el-dropdown @command="switchLocale">
          <el-button circle>
            <el-icon><Collection /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="zh-CN" :disabled="settingsStore.settings.locale === 'zh-CN'">中文</el-dropdown-item>
              <el-dropdown-item command="en-US" :disabled="settingsStore.settings.locale === 'en-US'">English</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-dropdown>
          <el-button type="primary">
            <el-icon class="el-icon--left"><Download /></el-icon>
            {{ t('nav.export') }}
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleExportPDF">
                <el-icon><Document /></el-icon>{{ t('nav.exportPDF') }}
              </el-dropdown-item>
              <el-dropdown-item @click="handleExportHTML">
                <el-icon><Monitor /></el-icon>{{ t('nav.exportHTML') }}
              </el-dropdown-item>
              <el-dropdown-item @click="handleExportJSON">
                <el-icon><Files /></el-icon>{{ t('nav.exportJSON') }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-upload
          :auto-upload="false"
          :show-file-list="false"
          accept=".json"
          :on-change="handleImportJSON"
        >
          <el-button>
            <el-icon class="el-icon--left"><Upload /></el-icon>
            {{ t('nav.import') }}
          </el-button>
        </el-upload>

        <el-tooltip :content="t('nav.reset')">
          <el-button circle type="danger" plain @click="handleReset">
            <el-icon><RefreshRight /></el-icon>
          </el-button>
        </el-tooltip>

        <el-tooltip :content="settingsStore.settings.editorCollapsed ? t('editor.expand') : t('editor.collapse')">
          <el-button circle @click="settingsStore.toggleEditor">
            <el-icon><component :is="settingsStore.settings.editorCollapsed ? 'Expand' : 'Fold'" /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
    </header>

    <div class="main-container">
      <aside class="editor-panel" :class="{ collapsed: settingsStore.settings.editorCollapsed }">
        <EditorPanel />
      </aside>
      <main class="preview-panel">
        <PreviewPanel ref="previewRef" />
      </main>
    </div>

    <AIAssistant v-model:visible="showAI" />
  </div>
</template>
