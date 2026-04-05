<script setup lang="ts">
import { useI18n } from 'vue-i18n'
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
</script>

<template>
  <div class="editor-panel-inner">
    <h3 class="editor-title">
      <el-icon><EditPen /></el-icon>
      {{ t('editor.title') }}
    </h3>
    <PersonalEditor />
    <ObjectiveEditor />
    <ExperienceEditor />
    <EducationEditor />
    <SkillsEditor />
    <ProjectsEditor />
    <LanguagesEditor />
    <SummaryEditor />
    <CustomSectionEditor />
  </div>
</template>

<style scoped lang="scss">
.editor-panel-inner {
  max-width: 600px;
  margin: 0 auto;
}

.editor-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  margin-bottom: 16px;
  color: var(--el-text-color-primary);
}
</style>
