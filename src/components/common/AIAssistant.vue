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

/** AI 返回的 JSON 不含头像；importData 会整表覆盖，需在写入后恢复本地头像 */
function applyAiImport(parsed: unknown) {
  const prevAvatar = resumeStore.data.personal.avatar
  resumeStore.importData(parsed as ResumeData)
  if (prevAvatar?.trim()) {
    resumeStore.data.personal.avatar = prevAvatar
  }
}

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{ 'update:visible': [value: boolean] }>()

const { t } = useI18n()
const settingsStore = useSettingsStore()
const resumeStore = useResumeStore()
const loading = ref(false)
const activeTab = ref('optimize')
const jobDescription = ref('')
const pasteText = ref('')

const currentModels = computed(() => {
  return AI_MODELS[settingsStore.aiConfig.provider] || []
})

watch(() => settingsStore.aiConfig.provider, (provider: AIProvider) => {
  const models = AI_MODELS[provider]
  if (models && models.length > 0) {
    settingsStore.setAIModel(models[0].value)
  }
})

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

async function handleOptimize() {
  if (!settingsStore.aiConfig.apiKey) {
    ElMessage.warning(t('ai.noApiKey'))
    return
  }
  loading.value = true
  try {
    const result = await callAI(
      settingsStore.aiConfig,
      AI_PROMPTS.optimize,
      JSON.stringify(resumeDataForAiUserMessage(resumeStore.data), null, 2)
    )
    const parsed = parseAIJsonResponse(result)
    applyAiImport(parsed)
    ElMessage.success(t('ai.success'))
  } catch (e: any) {
    ElMessage.error(t('ai.error') + ': ' + (e.message || ''))
  } finally {
    loading.value = false
  }
}

async function handleGenerate() {
  if (!settingsStore.aiConfig.apiKey) {
    ElMessage.warning(t('ai.noApiKey'))
    return
  }
  if (!jobDescription.value.trim()) return
  loading.value = true
  try {
    const result = await callAI(
      settingsStore.aiConfig,
      AI_PROMPTS.generate,
      jobDescription.value
    )
    const parsed = parseAIJsonResponse<{
      objective?: string
      summary?: string
      skills?: string[]
    }>(result)
    if (parsed.objective) resumeStore.data.objective = parsed.objective
    if (parsed.summary) resumeStore.data.summary = parsed.summary
    if (parsed.skills) resumeStore.data.skills = parsed.skills
    ElMessage.success(t('ai.success'))
  } catch (e: any) {
    ElMessage.error(t('ai.error') + ': ' + (e.message || ''))
  } finally {
    loading.value = false
  }
}

async function handleTranslate(target: 'en' | 'zh') {
  if (!settingsStore.aiConfig.apiKey) {
    ElMessage.warning(t('ai.noApiKey'))
    return
  }
  loading.value = true
  try {
    const prompt = target === 'en' ? AI_PROMPTS.translate_en : AI_PROMPTS.translate_zh
    const result = await callAI(
      settingsStore.aiConfig,
      prompt,
      JSON.stringify(resumeDataForAiUserMessage(resumeStore.data), null, 2)
    )
    const parsed = parseAIJsonResponse(result)
    applyAiImport(parsed)
    ElMessage.success(t('ai.success'))
  } catch (e: any) {
    ElMessage.error(t('ai.error') + ': ' + (e.message || ''))
  } finally {
    loading.value = false
  }
}

async function handleParse() {
  if (!settingsStore.aiConfig.apiKey) {
    ElMessage.warning(t('ai.noApiKey'))
    return
  }
  if (!pasteText.value.trim()) return
  loading.value = true
  try {
    const result = await callAI(
      settingsStore.aiConfig,
      AI_PROMPTS.parse,
      pasteText.value
    )
    const parsed = parseAIJsonResponse(result)
    applyAiImport(parsed)
    ElMessage.success(t('ai.success'))
    pasteText.value = ''
  } catch (e: any) {
    ElMessage.error(t('ai.error') + ': ' + (e.message || ''))
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="t('ai.title')"
    width="640px"
    top="8vh"
    destroy-on-close
  >
    <el-card shadow="never" class="ai-config-card">
      <template #header>
        <span style="font-size: 14px; font-weight: 600;">
          <el-icon><Setting /></el-icon>
          {{ t('ai.configTitle') }}
        </span>
      </template>
      <el-form label-position="top" size="default">
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item :label="t('ai.provider')">
              <el-select
                :model-value="settingsStore.aiConfig.provider"
                @update:model-value="settingsStore.setAIProvider($event as AIProvider)"
                style="width: 100%"
              >
                <el-option
                  v-for="p in AI_PROVIDERS"
                  :key="p.value"
                  :label="p.label"
                  :value="p.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('ai.model')">
              <el-select
                :model-value="settingsStore.aiConfig.model"
                @update:model-value="settingsStore.setAIModel($event)"
                style="width: 100%"
              >
                <el-option
                  v-for="m in currentModels"
                  :key="m.value"
                  :label="m.label"
                  :value="m.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item :label="t('ai.apiKey')">
              <el-input
                v-model="settingsStore.aiConfig.apiKey"
                type="password"
                show-password
                :placeholder="t('ai.apiKeyPlaceholder')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('ai.endpoint')">
              <el-input
                v-model="settingsStore.aiConfig.apiEndpoint"
                :placeholder="t('ai.endpointPlaceholder')"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-tabs v-model="activeTab" style="margin-top: 16px;">
      <el-tab-pane name="optimize" :label="t('ai.optimize')">
        <p class="ai-desc">{{ t('ai.optimizeDesc') }}</p>
        <el-button type="primary" :loading="loading" @click="handleOptimize" style="width: 100%;">
          <el-icon><MagicStick /></el-icon>
          {{ t('ai.optimize') }}
        </el-button>
      </el-tab-pane>

      <el-tab-pane name="generate" :label="t('ai.generate')">
        <p class="ai-desc">{{ t('ai.generateDesc') }}</p>
        <el-input
          v-model="jobDescription"
          type="textarea"
          :rows="5"
          :placeholder="t('ai.jobDescriptionPlaceholder')"
          style="margin-bottom: 12px;"
        />
        <el-button type="primary" :loading="loading" @click="handleGenerate" style="width: 100%;">
          <el-icon><MagicStick /></el-icon>
          {{ t('ai.generate') }}
        </el-button>
      </el-tab-pane>

      <el-tab-pane name="translate" :label="t('ai.translate')">
        <p class="ai-desc">{{ t('ai.translateDesc') }}</p>
        <div style="display: flex; gap: 12px;">
          <el-button type="primary" :loading="loading" @click="handleTranslate('en')" style="flex: 1;">
            {{ t('ai.toEnglish') }}
          </el-button>
          <el-button type="primary" :loading="loading" @click="handleTranslate('zh')" style="flex: 1;">
            {{ t('ai.toChinese') }}
          </el-button>
        </div>
      </el-tab-pane>

      <el-tab-pane name="parse" :label="t('ai.parse')">
        <p class="ai-desc">{{ t('ai.parseDesc') }}</p>
        <el-input
          v-model="pasteText"
          type="textarea"
          :rows="8"
          :placeholder="t('ai.pasteResumePlaceholder')"
          style="margin-bottom: 12px;"
        />
        <el-button type="primary" :loading="loading" @click="handleParse" style="width: 100%;">
          <el-icon><MagicStick /></el-icon>
          {{ t('ai.parse') }}
        </el-button>
      </el-tab-pane>
    </el-tabs>

    <div v-if="loading" class="ai-loading">
      <el-icon class="is-loading" :size="24"><Loading /></el-icon>
      <span>{{ t('ai.processing') }}</span>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
.ai-config-card {
  :deep(.el-card__header) {
    padding: 10px 16px;
  }
  :deep(.el-card__body) {
    padding: 12px 16px;
  }
}

.ai-desc {
  color: var(--el-text-color-secondary);
  font-size: 13px;
  margin-bottom: 12px;
}

.ai-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  color: var(--el-color-primary);
}
</style>
