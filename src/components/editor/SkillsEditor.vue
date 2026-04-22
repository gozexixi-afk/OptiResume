<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useResumeStore } from '@/stores/resume'
import RichTextEditor from '@/components/common/RichTextEditor.vue'

const { t } = useI18n()
const store = useResumeStore()
</script>

<template>
  <el-card class="section-card" shadow="hover">
    <el-empty v-if="store.data.skills.length === 0" :description="t('skills.empty')" :image-size="60" />

    <div v-for="skill in store.data.skills" :key="skill.id" class="item-card">
      <div class="item-actions">
        <el-button size="small" circle text type="danger" @click="store.removeSkill(skill.id)">
          <el-icon><Delete /></el-icon>
        </el-button>
      </div>
      <el-form label-position="top" class="module-form">
        <el-row :gutter="12">
          <el-col :span="8">
            <el-form-item :label="t('skills.name')">
              <el-input v-model="skill.name" :placeholder="t('skills.namePlaceholder')" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="t('skills.description')">
          <RichTextEditor v-model="skill.description" :placeholder="t('skills.descriptionPlaceholder')" class="fixed-editor" />
        </el-form-item>
      </el-form>
    </div>
    <div class="module-footer">
      <el-button type="primary" @click="store.addSkill">
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

.fixed-editor {
  :deep(.ProseMirror) {
    min-height: 170px;
  }
}
</style>
