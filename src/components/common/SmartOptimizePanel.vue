<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/stores/settings'
import { useResumeStore } from '@/stores/resume'
import {
  AI_PROVIDERS,
  AI_MODELS,
  callAI,
  AI_PROMPTS,
  parseAIJsonResponse,
  resumeDataForAiUserMessage
} from '@/utils/ai'
import { ElMessage } from 'element-plus'
import type { AIProvider, ResumeData } from '@/types/resume'
import { v4 as uuidv4 } from 'uuid'
import AIDiffDialog from './AIDiffDialog.vue'

const { t } = useI18n()
const settingsStore = useSettingsStore()
const resumeStore = useResumeStore()
const loading = ref(false)
const activeTab = ref('optimize')
const jobDescription = ref('')
const pasteText = ref('')

const currentModels = computed(() => AI_MODELS[settingsStore.aiConfig.provider] || [])

watch(() => settingsStore.aiConfig.provider, (provider: AIProvider) => {
  const models = AI_MODELS[provider]
  if (models?.length) settingsStore.setAIModel(models[0].value)
})

const showDiff = ref(false)
const snapshotBefore = ref<ResumeData | null>(null)
const aiResult = ref<Partial<ResumeData> | null>(null)

function takeSnapshot(): ResumeData {
  return JSON.parse(JSON.stringify(resumeStore.data))
}

function normalizeAiResult(raw: Partial<ResumeData>): Partial<ResumeData> {
  const ensureIds = <T extends { id?: string }>(list: T[] | undefined): T[] | undefined => {
    if (!Array.isArray(list)) return list
    return list.map(item => ({
      ...item,
      id: typeof item.id === 'string' && item.id ? item.id : uuidv4()
    }))
  }
  return {
    ...raw,
    experience: ensureIds(raw.experience as any) as any,
    education: ensureIds(raw.education as any) as any,
    projects: ensureIds(raw.projects as any) as any,
    customSections: ensureIds(raw.customSections as any) as any
  }
}

function openDiff(parsed: Partial<ResumeData>) {
  snapshotBefore.value = takeSnapshot()
  aiResult.value = normalizeAiResult(parsed)
  showDiff.value = true
}

function handleDiffApply(selected: Record<string, boolean>) {
  const after = aiResult.value
  if (!after) return

  resumeStore.pushHistory()
  const d = resumeStore.data
  const prevAvatar = d.personal.avatar

  if (selected.personal && after.personal) {
    Object.assign(d.personal, after.personal)
    d.personal.avatar = prevAvatar
  }
  if (selected.objective && after.objective) d.objective = after.objective
  if (selected.summary && after.summary) d.summary = after.summary
  if (selected.experience && Array.isArray(after.experience) && after.experience.length) d.experience = after.experience as any
  if (selected.education && Array.isArray(after.education) && after.education.length) d.education = after.education as any
  if (selected.skills && Array.isArray(after.skills) && after.skills.length) d.skills = after.skills
  if (selected.projects && Array.isArray(after.projects) && after.projects.length) d.projects = after.projects as any
  if (selected.languages && Array.isArray(after.languages) && after.languages.length) d.languages = after.languages as any
  if (selected.customSections && Array.isArray(after.customSections) && after.customSections.length) d.customSections = after.customSections as any

  ElMessage.success(t('ai.success'))
}

function resolveAiError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err)
  const lower = msg.toLowerCase()
  if (lower.includes('insufficient balance') || msg.includes('余额不足')) return t('ai.errorInsufficientBalance') || msg
  if (lower.includes('invalid_api_key') || lower.includes('invalid api key')) return t('ai.errorInvalidKey') || msg
  if (lower.includes('rate limit') || lower.includes('too many requests') || msg.includes('429')) return t('ai.errorRateLimit') || msg
  return `${t('ai.error')}: ${msg}`
}

async function runAI(prompt: string, input: string) {
  if (!settingsStore.aiConfig.apiKey) {
    ElMessage.warning(t('ai.noApiKey'))
    return
  }
  loading.value = true
  try {
    const result = await callAI(settingsStore.aiConfig, prompt, input)
    openDiff(parseAIJsonResponse(result) as Partial<ResumeData>)
  } catch (e) {
    ElMessage.error(resolveAiError(e))
  } finally {
    loading.value = false
  }
}

function handleOptimize() {
  runAI(AI_PROMPTS.optimize, JSON.stringify(resumeDataForAiUserMessage(resumeStore.data), null, 2))
}

function handleGenerate() {
  if (!jobDescription.value.trim()) return
  runAI(AI_PROMPTS.generate, jobDescription.value)
}

function handleTranslate(target: 'en' | 'zh') {
  const prompt = target === 'en' ? AI_PROMPTS.translate_en : AI_PROMPTS.translate_zh
  runAI(prompt, JSON.stringify(resumeDataForAiUserMessage(resumeStore.data), null, 2))
}

function handleParse() {
  if (!pasteText.value.trim()) return
  runAI(AI_PROMPTS.parse, pasteText.value)
  pasteText.value = ''
}
</script>

<template>
  <div class="smart-optimize-panel">
    <el-card shadow="never" class="ai-config-card">
      <template #header>
        <span class="panel-title">
          <el-icon><Setting /></el-icon>
          {{ t('ai.configTitle') }}
        </span>
      </template>
      <el-form label-position="top">
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item :label="t('ai.provider')">
              <el-select
                :model-value="settingsStore.aiConfig.provider"
                @update:model-value="settingsStore.setAIProvider($event as AIProvider)"
              >
                <el-option v-for="p in AI_PROVIDERS" :key="p.value" :label="p.label" :value="p.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('ai.model')">
              <el-select
                :model-value="settingsStore.aiConfig.model"
                @update:model-value="settingsStore.setAIModel($event)"
              >
                <el-option v-for="m in currentModels" :key="m.value" :label="m.label" :value="m.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item :label="t('ai.apiKey')">
              <el-input v-model="settingsStore.aiConfig.apiKey" type="password" show-password :placeholder="t('ai.apiKeyPlaceholder')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('ai.endpoint')">
              <el-input v-model="settingsStore.aiConfig.apiEndpoint" :placeholder="t('ai.endpointPlaceholder')" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-tabs v-model="activeTab">
      <el-tab-pane name="optimize" :label="t('ai.optimize')">
        <p class="ai-desc">{{ t('ai.optimizeDesc') }}</p>
        <el-button type="primary" :loading="loading" @click="handleOptimize">{{ t('ai.optimize') }}</el-button>
      </el-tab-pane>
      <el-tab-pane name="generate" :label="t('ai.generate')">
        <p class="ai-desc">{{ t('ai.generateDesc') }}</p>
        <el-input v-model="jobDescription" type="textarea" :rows="4" :placeholder="t('ai.jobDescriptionPlaceholder')" />
        <el-button type="primary" :loading="loading" @click="handleGenerate">{{ t('ai.generate') }}</el-button>
      </el-tab-pane>
      <el-tab-pane name="translate" :label="t('ai.translate')">
        <p class="ai-desc">{{ t('ai.translateDesc') }}</p>
        <div class="inline-actions">
          <el-button type="primary" :loading="loading" @click="handleTranslate('en')">{{ t('ai.toEnglish') }}</el-button>
          <el-button type="primary" :loading="loading" @click="handleTranslate('zh')">{{ t('ai.toChinese') }}</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane name="parse" :label="t('ai.parse')">
        <p class="ai-desc">{{ t('ai.parseDesc') }}</p>
        <el-input v-model="pasteText" type="textarea" :rows="6" :placeholder="t('ai.pasteResumePlaceholder')" />
        <el-button type="primary" :loading="loading" @click="handleParse">{{ t('ai.parse') }}</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>

  <AIDiffDialog
    v-if="snapshotBefore && aiResult"
    v-model:visible="showDiff"
    :before="snapshotBefore"
    :after="aiResult"
    @apply="handleDiffApply"
  />
</template>

<style scoped lang="scss">
.smart-optimize-panel {
  padding: 12px 16px 2px;
  border-bottom: 1px solid var(--or-border-color);
  background: var(--or-bg-card);
}

.panel-title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
}

.ai-config-card {
  margin-bottom: 10px;
}

.ai-desc {
  color: var(--el-text-color-secondary);
  font-size: 13px;
  margin-bottom: 8px;
}

.inline-actions {
  display: flex;
  gap: 10px;
}

:deep(.el-button + .el-button) {
  margin-left: 0;
}

:deep(.el-tab-pane .el-button) {
  margin-top: 10px;
}
</style>
