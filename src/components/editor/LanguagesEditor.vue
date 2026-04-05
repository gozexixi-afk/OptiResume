<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useResumeStore } from '@/stores/resume'

const { t } = useI18n()
const store = useResumeStore()

const levelOptions = ['native', 'fluent', 'advanced', 'intermediate', 'basic'] as const
</script>

<template>
  <el-card class="section-card" shadow="hover">
    <template #header>
      <div class="section-header">
        <span class="section-title">
          <el-icon><ChatDotSquare /></el-icon>
          {{ t('languages.title') }}
        </span>
        <el-button type="primary" size="small" @click="store.addLanguage">
          <el-icon><Plus /></el-icon>
          {{ t('languages.add') }}
        </el-button>
      </div>
    </template>

    <el-empty v-if="store.data.languages.length === 0" :description="t('languages.empty')" />

    <div
      v-for="(lang, index) in store.data.languages"
      :key="index"
      class="item-card"
    >
      <div class="item-actions">
        <el-button size="small" circle text type="danger" @click="store.removeLanguage(index)">
          <el-icon><Delete /></el-icon>
        </el-button>
      </div>

      <el-form label-position="top" size="default">
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item :label="t('languages.name')">
              <el-input v-model="lang.name" :placeholder="t('languages.namePlaceholder')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('languages.level')">
              <el-select v-model="lang.level" :placeholder="t('languages.levelPlaceholder')" style="width: 100%">
                <el-option
                  v-for="lv in levelOptions"
                  :key="lv"
                  :label="t(`languages.levels.${lv}`)"
                  :value="lv"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </el-card>
</template>
