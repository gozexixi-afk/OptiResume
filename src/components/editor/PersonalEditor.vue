<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useResumeStore } from '@/stores/resume'

const { t } = useI18n()
const store = useResumeStore()

function handleAvatarUpload(file: File) {
  const reader = new FileReader()
  reader.onload = (e) => {
    store.data.personal.avatar = e.target?.result as string
  }
  reader.readAsDataURL(file)
  return false
}
</script>

<template>
  <el-card class="section-card" shadow="hover">
    <template #header>
      <div class="section-header">
        <span class="section-title">
          <el-icon><User /></el-icon>
          {{ t('personal.title') }}
        </span>
      </div>
    </template>

    <el-form label-position="top" size="default">
      <el-form-item :label="t('personal.avatar')">
        <div class="avatar-upload">
          <el-upload
            :auto-upload="false"
            :show-file-list="false"
            accept="image/*"
            :before-upload="handleAvatarUpload"
            :on-change="(f: any) => f.raw && handleAvatarUpload(f.raw)"
          >
            <el-avatar
              :size="80"
              :src="store.data.personal.avatar || undefined"
            >
              <el-icon :size="32"><Plus /></el-icon>
            </el-avatar>
          </el-upload>
          <el-button
            v-if="store.data.personal.avatar"
            size="small"
            type="danger"
            text
            @click="store.data.personal.avatar = ''"
          >
            {{ t('actions.delete') }}
          </el-button>
        </div>
      </el-form-item>

      <el-row :gutter="12">
        <el-col :span="12">
          <el-form-item :label="t('personal.name')">
            <el-input v-model="store.data.personal.name" :placeholder="t('personal.namePlaceholder')" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="t('personal.jobTitle')">
            <el-input v-model="store.data.personal.title" :placeholder="t('personal.jobTitlePlaceholder')" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="12">
        <el-col :span="12">
          <el-form-item :label="t('personal.email')">
            <el-input v-model="store.data.personal.email" :placeholder="t('personal.emailPlaceholder')">
              <template #prefix><el-icon><Message /></el-icon></template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="t('personal.phone')">
            <el-input v-model="store.data.personal.phone" :placeholder="t('personal.phonePlaceholder')">
              <template #prefix><el-icon><Phone /></el-icon></template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="12">
        <el-col :span="12">
          <el-form-item :label="t('personal.location')">
            <el-input v-model="store.data.personal.location" :placeholder="t('personal.locationPlaceholder')">
              <template #prefix><el-icon><Location /></el-icon></template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="t('personal.website')">
            <el-input v-model="store.data.personal.website" :placeholder="t('personal.websitePlaceholder')">
              <template #prefix><el-icon><Link /></el-icon></template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>

<style scoped lang="scss">
.avatar-upload {
  display: flex;
  align-items: center;
  gap: 12px;

  .el-avatar {
    cursor: pointer;
    border: 2px dashed var(--el-border-color);
    transition: border-color 0.3s;

    &:hover {
      border-color: var(--el-color-primary);
    }
  }
}
</style>
