<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useResumeStore } from '@/stores/resume'

const { t } = useI18n()
const store = useResumeStore()
const newSkill = ref('')

function addSkill() {
  const skill = newSkill.value.trim()
  if (skill) {
    store.addSkill(skill)
    newSkill.value = ''
  }
}
</script>

<template>
  <el-card class="section-card" shadow="hover">
    <template #header>
      <div class="section-header">
        <span class="section-title">
          <el-icon><SetUp /></el-icon>
          {{ t('skills.title') }}
        </span>
      </div>
    </template>

    <div class="skills-input">
      <el-input
        v-model="newSkill"
        :placeholder="t('skills.placeholder')"
        @keyup.enter="addSkill"
      >
        <template #append>
          <el-button @click="addSkill">
            <el-icon><Plus /></el-icon>
          </el-button>
        </template>
      </el-input>
    </div>

    <div class="skills-tags" v-if="store.data.skills.length > 0">
      <el-tag
        v-for="(skill, index) in store.data.skills"
        :key="index"
        closable
        size="large"
        @close="store.removeSkill(index)"
      >
        {{ skill }}
      </el-tag>
    </div>
    <el-empty v-else :description="t('skills.empty')" :image-size="60" />
  </el-card>
</template>

<style scoped lang="scss">
.skills-input {
  margin-bottom: 12px;
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
