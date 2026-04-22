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
        <div class="section-extra">
          <el-icon><EditPen /></el-icon>
        </div>
      </div>
    </template>

    <el-form label-position="top" size="default" class="three-col-form">
      <h4 class="group-title">{{ t('personal.basicInfo') }}</h4>
      <el-row :gutter="12">
        <el-col :span="8">
          <el-form-item :label="t('personal.name')">
            <el-input v-model="store.data.personal.name" :placeholder="t('personal.namePlaceholder')" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="t('personal.phone')">
            <el-input v-model="store.data.personal.phone" :placeholder="t('personal.phonePlaceholder')" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="t('personal.email')">
            <el-input v-model="store.data.personal.email" :placeholder="t('personal.emailPlaceholder')" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="12">
        <el-col :span="8">
          <el-form-item :label="t('personal.avatar')">
            <div class="avatar-upload">
              <el-upload
                :auto-upload="false"
                :show-file-list="false"
                accept="image/*"
                :before-upload="handleAvatarUpload"
                :on-change="(f: any) => f.raw && handleAvatarUpload(f.raw)"
              >
                <div class="avatar-box">
                  <el-avatar
                    v-if="store.data.personal.avatar"
                    :size="80"
                    :src="store.data.personal.avatar || undefined"
                  />
                  <el-icon v-else :size="26"><Plus /></el-icon>
                </div>
              </el-upload>
              <el-button
                v-if="store.data.personal.avatar"
                size="small"
                text
                type="danger"
                @click="store.data.personal.avatar = ''"
              >
                {{ t('actions.delete') }}
              </el-button>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="t('personal.wechat')">
            <el-input v-model="store.data.personal.wechat" :placeholder="t('personal.wechatPlaceholder')" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="t('personal.github')">
            <el-input v-model="store.data.personal.github" :placeholder="t('personal.githubPlaceholder')" />
          </el-form-item>
        </el-col>
      </el-row>

      <h4 class="group-title">{{ t('personal.jobIntent') }}</h4>
      <el-row :gutter="12">
        <el-col :span="8">
          <el-form-item :label="t('personal.status')">
            <el-input v-model="store.data.personal.status" :placeholder="t('personal.statusPlaceholder')" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="t('personal.jobTitle')">
            <el-input v-model="store.data.personal.title" :placeholder="t('personal.jobTitlePlaceholder')" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="t('personal.expectedLocation')">
            <el-input v-model="store.data.personal.expectedLocation" :placeholder="t('personal.expectedLocationPlaceholder')" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :span="8">
          <el-form-item :label="t('personal.expectedSalary')">
            <el-input v-model="store.data.personal.expectedSalary" :placeholder="t('personal.expectedSalaryPlaceholder')" />
          </el-form-item>
        </el-col>
      </el-row>

      <h4 class="group-title">{{ t('personal.otherInfo') }}</h4>
      <el-row :gutter="12">
        <el-col :span="8">
          <el-form-item :label="t('personal.location')">
            <el-input v-model="store.data.personal.location" :placeholder="t('personal.locationPlaceholder')" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="t('personal.website')">
            <el-input v-model="store.data.personal.website" :placeholder="t('personal.websitePlaceholder')" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>

<style scoped lang="scss">
.group-title {
  font-size: 24px;
  margin: 6px 0 12px;
  line-height: 1;
}

.section-extra {
  position: absolute;
  right: 0;
  color: var(--el-text-color-secondary);
}

.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.avatar-box {
  width: 80px;
  height: 100px;
  border: 1px solid var(--el-border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  color: var(--el-text-color-secondary);
  background: #fff;
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover {
    border-color: var(--el-color-primary);
  }

  :deep(.el-avatar) {
    cursor: pointer;
    border-radius: 2px;
  }
}
</style>
