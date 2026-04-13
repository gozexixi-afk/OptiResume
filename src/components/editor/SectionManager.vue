<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useResumeStore } from '@/stores/resume'
import type { ResumeSectionKey } from '@/types/resume'
import PersonalEditor from './PersonalEditor.vue'
import ObjectiveEditor from './ObjectiveEditor.vue'
import ExperienceEditor from './ExperienceEditor.vue'
import EducationEditor from './EducationEditor.vue'
import SkillsEditor from './SkillsEditor.vue'
import ProjectsEditor from './ProjectsEditor.vue'
import LanguagesEditor from './LanguagesEditor.vue'
import SummaryEditor from './SummaryEditor.vue'
import CustomSectionEditor from './CustomSectionEditor.vue'

const { t } = useI18n()
const store = useResumeStore()

const sectionMeta: Record<ResumeSectionKey, { icon: string; labelKey: string }> = {
  personal: { icon: 'User', labelKey: 'personal.title' },
  objective: { icon: 'Aim', labelKey: 'objective.title' },
  summary: { icon: 'Document', labelKey: 'summary.title' },
  experience: { icon: 'Briefcase', labelKey: 'experience.title' },
  education: { icon: 'School', labelKey: 'education.title' },
  skills: { icon: 'MagicStick', labelKey: 'skills.title' },
  projects: { icon: 'Folder', labelKey: 'projects.title' },
  languages: { icon: 'ChatLineRound', labelKey: 'languages.title' },
  customSections: { icon: 'Grid', labelKey: 'customSection.title' }
}

const sections = computed(() => store.sectionOrder.map((key, index) => ({
  key,
  index,
  icon: sectionMeta[key].icon,
  label: t(sectionMeta[key].labelKey)
})))

const editorComponentMap: Record<ResumeSectionKey, unknown> = {
  personal: PersonalEditor,
  objective: ObjectiveEditor,
  summary: SummaryEditor,
  experience: ExperienceEditor,
  education: EducationEditor,
  skills: SkillsEditor,
  projects: ProjectsEditor,
  languages: LanguagesEditor,
  customSections: CustomSectionEditor
}

const activeSections = ref<ResumeSectionKey[]>([])

watch(
  sections,
  (list) => {
    const validKeys = new Set(list.map(item => item.key))
    activeSections.value = activeSections.value.filter(key => validKeys.has(key))
    if (activeSections.value.length === 0 && list.length > 0) {
      activeSections.value = [list[0].key]
    }
  },
  { immediate: true }
)
</script>

<template>
  <el-card class="section-card section-manager" shadow="hover">
    <template #header>
      <div class="section-header">
        <span class="section-title">
          <el-icon><Operation /></el-icon>
          {{ t('editor.moduleManager') }}
        </span>
      </div>
    </template>

    <el-collapse v-model="activeSections" class="module-list">
      <el-collapse-item
        v-for="item in sections"
        :key="item.key"
        :name="item.key"
        class="module-item"
      >
        <template #title>
          <div class="module-header">
            <div class="module-left">
              <el-icon><component :is="item.icon" /></el-icon>
              <span>{{ item.label }}</span>
            </div>
            <div class="module-actions" @click.stop>
              <el-tooltip :content="t('actions.moveUp')">
                <el-button
                  size="small"
                  circle
                  text
                  :disabled="item.index === 0"
                  @click.stop="store.moveSection(item.index, item.index - 1)"
                >
                  <el-icon><Top /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip :content="t('actions.moveDown')">
                <el-button
                  size="small"
                  circle
                  text
                  :disabled="item.index === sections.length - 1"
                  @click.stop="store.moveSection(item.index, item.index + 1)"
                >
                  <el-icon><Bottom /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip :content="t('actions.delete')">
                <el-button
                  size="small"
                  circle
                  text
                  type="danger"
                  :disabled="sections.length <= 1"
                  @click.stop="store.removeSection(item.key)"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </el-tooltip>
            </div>
          </div>
        </template>
        <div class="module-editor">
          <component :is="editorComponentMap[item.key]" />
        </div>
      </el-collapse-item>
    </el-collapse>
  </el-card>
</template>

<style scoped lang="scss">
.section-manager {
  margin-bottom: 14px;
}

.module-list {
  border: none;
}

.module-item {
  background: var(--el-fill-color-light);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  margin-bottom: 8px;
  overflow: hidden;
}

.module-header {
  width: 100%;
  padding-right: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.module-left {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--el-text-color-primary);
}

.module-actions {
  display: flex;
  align-items: center;
  gap: 2px;
}

.module-editor {
  padding: 4px;
}

:deep(.module-item .el-collapse-item__header) {
  background-color: transparent;
  border-bottom: none;
  padding: 8px 10px;
  min-height: 44px;
}

:deep(.module-item .el-collapse-item__wrap) {
  background-color: transparent;
  border-bottom: none;
}

:deep(.module-item .el-collapse-item__content) {
  padding-bottom: 0;
}
</style>
