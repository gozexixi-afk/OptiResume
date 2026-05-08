<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useResumeStore } from '@/stores/resume'
import RichTextEditor from '@/components/common/RichTextEditor.vue'

const { t } = useI18n()
const store = useResumeStore()

function stripHtml(value: string): string {
  return value
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim()
}

function isSkillNameEmpty(name: string): boolean {
  return !stripHtml(name)
}

const hasEmptySkill = computed(() => store.data.skills.some(skill => isSkillNameEmpty(skill.name)))

function cleanupEmptySkills() {
  store.data.skills = store.data.skills.filter(skill => !isSkillNameEmpty(skill.name))
}

function handleAddSkill() {
  cleanupEmptySkills()
  if (hasEmptySkill.value) return
  store.addSkill()
}

function handleRemoveSkill(id: string | undefined, index: number) {
  if (id) {
    store.removeSkill(id)
    return
  }
  store.removeSkillByIndex(index)
}
</script>

<template>
  <el-card class="section-card" shadow="hover">
    <el-empty v-if="store.data.skills.length === 0" :description="t('skills.empty')" :image-size="60" />

    <div v-for="(skill, index) in store.data.skills" :key="skill.id || index" class="item-card">
      <div class="item-actions">
        <el-button
          size="small"
          circle
          text
          type="danger"
          @click.stop="handleRemoveSkill(skill.id, index)"
        >
          <el-icon><Delete /></el-icon>
        </el-button>
      </div>
      <el-form label-position="top" class="module-form">
        <el-row :gutter="12">
          <el-col :span="8">
            <el-form-item :label="t('skills.name')">
              <RichTextEditor
                v-model="skill.name"
                :placeholder="t('skills.namePlaceholder')"
                class="skill-name-editor"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="module-footer">
      <el-button type="primary" :disabled="hasEmptySkill" @click="handleAddSkill">
        <el-icon><Plus /></el-icon>
        {{ t('skills.add') }}
      </el-button>
    </div>
  </el-card>
</template>

<style scoped lang="scss">
.module-form {
  padding-top: 2px;
}

.module-footer {
  display: flex;
  justify-content: flex-start;
  padding-top: 4px;
  border-top: 1px dashed var(--el-border-color-lighter);
}

.skill-name-editor {
  :deep(.ProseMirror) {
    min-height: 72px;
  }
}

:deep(.item-actions) {
  z-index: 3;
}
</style>
