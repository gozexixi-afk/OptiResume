<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useResumeStore } from '@/stores/resume'

const { t } = useI18n()
const store = useResumeStore()
</script>

<template>
  <el-card class="section-card" shadow="hover">
    <template #header>
      <div class="section-header">
        <span class="section-title">
          <el-icon><FolderOpened /></el-icon>
          {{ t('projects.title') }}
        </span>
        <el-button type="primary" size="small" @click="store.addProject">
          <el-icon><Plus /></el-icon>
          {{ t('projects.add') }}
        </el-button>
      </div>
    </template>

    <el-empty v-if="store.data.projects.length === 0" :description="t('projects.empty')" />

    <div
      v-for="proj in store.data.projects"
      :key="proj.id"
      class="item-card"
    >
      <div class="item-actions">
        <el-button size="small" circle text type="danger" @click="store.removeProject(proj.id)">
          <el-icon><Delete /></el-icon>
        </el-button>
      </div>

      <el-form label-position="top" size="default">
        <el-form-item :label="t('projects.name')">
          <el-input v-model="proj.name" :placeholder="t('projects.namePlaceholder')" />
        </el-form-item>

        <el-form-item :label="t('projects.description')">
          <el-input
            v-model="proj.description"
            type="textarea"
            :rows="3"
            :placeholder="t('projects.descriptionPlaceholder')"
          />
        </el-form-item>

        <el-form-item :label="t('projects.link')">
          <el-input v-model="proj.link" :placeholder="t('projects.linkPlaceholder')">
            <template #prefix><el-icon><Link /></el-icon></template>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>
