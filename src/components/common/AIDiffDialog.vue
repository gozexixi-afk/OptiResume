<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ResumeData, ExperienceItem, EducationItem, ProjectItem, LanguageItem, CustomSection } from '@/types/resume'

const props = defineProps<{
  visible: boolean
  before: ResumeData
  after: Partial<ResumeData>
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  apply: [selected: Record<string, boolean>]
}>()

const { t } = useI18n()

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

interface DiffSection {
  key: string
  label: string
  beforeText: string
  afterText: string
  hasChange: boolean
}

const selected = ref<Record<string, boolean>>({})

function makeStringSection(key: string, label: string, before: string, afterRaw: string | undefined): DiffSection {
  const afterText = (afterRaw !== undefined && afterRaw !== null && String(afterRaw).trim() !== '') ? String(afterRaw) : before
  return {
    key,
    label,
    beforeText: before,
    afterText,
    hasChange: before !== afterText
  }
}

const sections = computed<DiffSection[]>(() => {
  const b = props.before
  const a = props.after
  const list: DiffSection[] = []

  const personalBefore = formatPersonal(b)
  const personalAfter = a.personal ? formatPersonal({ ...b, personal: { ...b.personal, ...a.personal, avatar: b.personal.avatar } }) : personalBefore
  list.push({
    key: 'personal',
    label: t('personal.title'),
    beforeText: personalBefore,
    afterText: personalAfter,
    hasChange: personalBefore !== personalAfter
  })

  list.push(makeStringSection('objective', t('objective.title'), b.objective, a.objective))
  list.push(makeStringSection('summary', t('summary.title'), b.summary, a.summary))

  const expBefore = formatExperience(b.experience)
  const expAfter = a.experience?.length ? formatExperience(a.experience as ExperienceItem[]) : expBefore
  list.push({ key: 'experience', label: t('experience.title'), beforeText: expBefore, afterText: expAfter, hasChange: expBefore !== expAfter })

  const eduBefore = formatEducation(b.education)
  const eduAfter = a.education?.length ? formatEducation(a.education as EducationItem[]) : eduBefore
  list.push({ key: 'education', label: t('education.title'), beforeText: eduBefore, afterText: eduAfter, hasChange: eduBefore !== eduAfter })

  const skillsBefore = b.skills.join(', ')
  const skillsAfter = a.skills?.length ? a.skills.join(', ') : skillsBefore
  list.push({ key: 'skills', label: t('skills.title'), beforeText: skillsBefore, afterText: skillsAfter, hasChange: skillsBefore !== skillsAfter })

  const projBefore = formatProjects(b.projects)
  const projAfter = a.projects?.length ? formatProjects(a.projects as ProjectItem[]) : projBefore
  list.push({ key: 'projects', label: t('projects.title'), beforeText: projBefore, afterText: projAfter, hasChange: projBefore !== projAfter })

  const langBefore = formatLanguages(b.languages)
  const langAfter = a.languages?.length ? formatLanguages(a.languages as LanguageItem[]) : langBefore
  list.push({ key: 'languages', label: t('languages.title'), beforeText: langBefore, afterText: langAfter, hasChange: langBefore !== langAfter })

  const csBefore = formatCustomSections(b.customSections)
  const csAfter = a.customSections?.length ? formatCustomSections(a.customSections as CustomSection[]) : csBefore
  list.push({ key: 'customSections', label: t('customSection.title'), beforeText: csBefore, afterText: csAfter, hasChange: csBefore !== csAfter })

  return list
})

const changedSections = computed(() => sections.value.filter(s => s.hasChange))
const noChanges = computed(() => changedSections.value.length === 0)

watch(() => props.visible, (v) => {
  if (v) {
    const init: Record<string, boolean> = {}
    for (const s of sections.value) {
      init[s.key] = s.hasChange
    }
    selected.value = init
  }
})

const selectedCount = computed(() => Object.values(selected.value).filter(Boolean).length)

function selectAll() {
  for (const s of changedSections.value) selected.value[s.key] = true
}
function deselectAll() {
  for (const key of Object.keys(selected.value)) selected.value[key] = false
}

function handleApply() {
  emit('apply', { ...selected.value })
  dialogVisible.value = false
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim()
}

function formatPersonal(d: ResumeData): string {
  const p = d.personal
  return [p.name, p.title, p.email, p.phone, p.location, p.website].filter(Boolean).join(' | ')
}

function formatExperience(list: ExperienceItem[]): string {
  if (!list.length) return '-'
  return list.map(e =>
    `${e.position || '?'} @ ${e.company || '?'} (${e.startDate || '?'}-${e.isCurrent ? t('preview.present') : e.endDate || '?'})\n${e.description || ''}`
  ).join('\n---\n')
}

function formatEducation(list: EducationItem[]): string {
  if (!list.length) return '-'
  return list.map(e =>
    `${e.school || '?'} · ${e.degree || ''} ${e.field || ''} (${e.startDate || '?'}-${e.endDate || '?'})`
  ).join('\n')
}

function formatProjects(list: ProjectItem[]): string {
  if (!list.length) return '-'
  return list.map(p => `${p.name || '?'}: ${p.description || ''}`).join('\n')
}

function formatLanguages(list: LanguageItem[]): string {
  if (!list.length) return '-'
  return list.map(l => `${l.name}${l.level ? ' (' + l.level + ')' : ''}`).join(', ')
}

function formatCustomSections(list: CustomSection[]): string {
  if (!list.length) return '-'
  return list.map(s => `【${s.title}】${s.content}`).join('\n')
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="t('diff.title')"
    width="900px"
    top="5vh"
    destroy-on-close
    :close-on-click-modal="false"
  >
    <div v-if="noChanges" class="diff-empty">
      <el-empty :description="t('diff.noChanges')" />
    </div>

    <template v-else>
      <div class="diff-actions-bar">
        <span class="diff-summary">
          {{ t('diff.changedCount', { count: changedSections.length }) }}
          ·
          {{ t('diff.selectedCount', { count: selectedCount }) }}
        </span>
        <div>
          <el-button size="small" text @click="selectAll">{{ t('diff.selectAll') }}</el-button>
          <el-button size="small" text @click="deselectAll">{{ t('diff.deselectAll') }}</el-button>
        </div>
      </div>

      <div class="diff-list">
        <div
          v-for="section in sections"
          :key="section.key"
          class="diff-section"
          :class="{ 'no-change': !section.hasChange }"
        >
          <div class="diff-section-header">
            <el-checkbox
              v-model="selected[section.key]"
              :disabled="!section.hasChange"
            >
              <span class="diff-section-label">{{ section.label }}</span>
              <el-tag v-if="!section.hasChange" size="small" type="info" class="ml-2">{{ t('diff.unchanged') }}</el-tag>
              <el-tag v-else size="small" type="warning" class="ml-2">{{ t('diff.changed') }}</el-tag>
            </el-checkbox>
          </div>

          <div v-if="section.hasChange" class="diff-columns">
            <div class="diff-col diff-col-before">
              <div class="diff-col-title">{{ t('diff.before') }}</div>
              <div class="diff-col-content">{{ section.key === 'summary' ? stripHtml(section.beforeText) : section.beforeText }}</div>
            </div>
            <div class="diff-arrow">
              <el-icon :size="18"><Right /></el-icon>
            </div>
            <div class="diff-col diff-col-after">
              <div class="diff-col-title">{{ t('diff.after') }}</div>
              <div class="diff-col-content">{{ section.key === 'summary' ? stripHtml(section.afterText) : section.afterText }}</div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <el-button @click="dialogVisible = false">{{ t('actions.cancel') }}</el-button>
      <el-button type="primary" :disabled="selectedCount === 0" @click="handleApply">
        <el-icon><Check /></el-icon>
        {{ t('diff.applySelected', { count: selectedCount }) }}
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.diff-empty {
  padding: 20px 0;
}

.diff-actions-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 8px 12px;
  background: var(--el-fill-color-lighter);
  border-radius: 6px;
}

.diff-summary {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.diff-list {
  max-height: 60vh;
  overflow-y: auto;
}

.diff-section {
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  margin-bottom: 10px;
  overflow: hidden;

  &.no-change {
    opacity: 0.55;
  }
}

.diff-section-header {
  padding: 10px 14px;
  background: var(--el-fill-color-lighter);
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.diff-section-label {
  font-weight: 600;
  font-size: 14px;
}

.ml-2 {
  margin-left: 8px;
}

.diff-columns {
  display: flex;
  align-items: stretch;
  gap: 0;
}

.diff-col {
  flex: 1;
  padding: 10px 14px;
  min-height: 48px;
}

.diff-col-before {
  background: #fef0f0;
  border-right: 1px solid var(--el-border-color-lighter);

  .diff-col-content {
    color: #c45656;
  }
}

html.dark .diff-col-before {
  background: rgba(245, 108, 108, 0.08);
}

.diff-col-after {
  background: #f0f9eb;

  .diff-col-content {
    color: #529b2e;
  }
}

html.dark .diff-col-after {
  background: rgba(103, 194, 58, 0.08);
}

.diff-col-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 6px;
  color: var(--el-text-color-secondary);
}

.diff-col-content {
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 200px;
  overflow-y: auto;
}

.diff-arrow {
  display: flex;
  align-items: center;
  padding: 0 6px;
  color: var(--el-text-color-placeholder);
}
</style>
