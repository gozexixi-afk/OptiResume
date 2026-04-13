<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useResumeStore } from '@/stores/resume'
import type { ResumeSectionKey } from '@/types/resume'

const { t } = useI18n()
const store = useResumeStore()
const orderedSections = computed(() => store.sectionOrder.filter(key => key !== 'personal'))

function isSectionVisible(section: ResumeSectionKey): boolean {
  switch (section) {
    case 'objective':
      return !!store.data.objective
    case 'summary':
      return !!store.data.summary
    case 'experience':
      return store.data.experience.length > 0
    case 'education':
      return store.data.education.length > 0
    case 'skills':
      return store.data.skills.length > 0
    case 'projects':
      return store.data.projects.length > 0
    case 'languages':
      return store.data.languages.length > 0
    case 'customSections':
      return store.data.customSections.length > 0
    default:
      return false
  }
}
</script>

<template>
  <div class="classic-template">
    <header v-if="store.hasSection('personal')" class="ct-header">
      <div class="ct-avatar" v-if="store.data.personal.avatar">
        <img :src="store.data.personal.avatar" alt="avatar" />
      </div>
      <div class="ct-info">
        <h1 class="ct-name">{{ store.data.personal.name || t('personal.name') }}</h1>
        <p class="ct-title" v-if="store.data.personal.title">{{ store.data.personal.title }}</p>
        <div class="ct-contact">
          <span v-if="store.data.personal.email">📧 {{ store.data.personal.email }}</span>
          <span v-if="store.data.personal.phone">📱 {{ store.data.personal.phone }}</span>
          <span v-if="store.data.personal.location">📍 {{ store.data.personal.location }}</span>
          <span v-if="store.data.personal.website">🔗 {{ store.data.personal.website }}</span>
        </div>
      </div>
    </header>

    <template v-for="section in orderedSections" :key="section">
      <section v-if="section === 'objective' && isSectionVisible(section)" class="ct-section">
        <h2 class="ct-section-title">{{ t('objective.title') }}</h2>
        <div class="ct-divider"></div>
        <p class="ct-text">{{ store.data.objective }}</p>
      </section>

      <section v-else-if="section === 'summary' && isSectionVisible(section)" class="ct-section">
        <h2 class="ct-section-title">{{ t('summary.title') }}</h2>
        <div class="ct-divider"></div>
        <div class="ct-text" v-html="store.data.summary"></div>
      </section>

      <section v-else-if="section === 'experience' && isSectionVisible(section)" class="ct-section">
        <h2 class="ct-section-title">{{ t('experience.title') }}</h2>
        <div class="ct-divider"></div>
        <div v-for="exp in store.data.experience" :key="exp.id" class="ct-item">
          <div class="ct-item-header">
            <div>
              <strong>{{ exp.position }}</strong>
              <span class="ct-company" v-if="exp.company"> · {{ exp.company }}</span>
            </div>
            <span class="ct-date">
              {{ exp.startDate }} - {{ exp.isCurrent ? t('preview.present') : exp.endDate }}
            </span>
          </div>
          <p class="ct-desc" v-if="exp.description">{{ exp.description }}</p>
        </div>
      </section>

      <section v-else-if="section === 'education' && isSectionVisible(section)" class="ct-section">
        <h2 class="ct-section-title">{{ t('education.title') }}</h2>
        <div class="ct-divider"></div>
        <div v-for="edu in store.data.education" :key="edu.id" class="ct-item">
          <div class="ct-item-header">
            <div>
              <strong>{{ edu.school }}</strong>
              <span v-if="edu.degree || edu.field"> · {{ edu.degree }} {{ edu.field }}</span>
            </div>
            <span class="ct-date">{{ edu.startDate }} - {{ edu.endDate }}</span>
          </div>
        </div>
      </section>

      <section v-else-if="section === 'skills' && isSectionVisible(section)" class="ct-section">
        <h2 class="ct-section-title">{{ t('skills.title') }}</h2>
        <div class="ct-divider"></div>
        <div class="ct-skills">
          <span v-for="(skill, i) in store.data.skills" :key="i" class="ct-skill-tag">{{ skill }}</span>
        </div>
      </section>

      <section v-else-if="section === 'projects' && isSectionVisible(section)" class="ct-section">
        <h2 class="ct-section-title">{{ t('projects.title') }}</h2>
        <div class="ct-divider"></div>
        <div v-for="proj in store.data.projects" :key="proj.id" class="ct-item">
          <div class="ct-item-header">
            <strong>{{ proj.name }}</strong>
            <a v-if="proj.link" :href="proj.link" class="ct-link" target="_blank">{{ proj.link }}</a>
          </div>
          <p class="ct-desc" v-if="proj.description">{{ proj.description }}</p>
        </div>
      </section>

      <section v-else-if="section === 'languages' && isSectionVisible(section)" class="ct-section">
        <h2 class="ct-section-title">{{ t('languages.title') }}</h2>
        <div class="ct-divider"></div>
        <div class="ct-langs">
          <span v-for="(lang, i) in store.data.languages" :key="i" class="ct-lang">
            {{ lang.name }}<template v-if="lang.level"> ({{ t(`languages.levels.${lang.level}`) || lang.level }})</template>
          </span>
        </div>
      </section>

      <template v-else-if="section === 'customSections' && isSectionVisible(section)">
        <section v-for="custom in store.data.customSections" :key="custom.id" class="ct-section">
          <h2 class="ct-section-title">{{ custom.title }}</h2>
          <div class="ct-divider"></div>
          <p class="ct-text">{{ custom.content }}</p>
        </section>
      </template>
    </template>
  </div>
</template>

<style scoped lang="scss">
.classic-template {
  padding: 32px 36px;
  font-family: 'Georgia', 'Times New Roman', serif;
  color: #333;
  font-size: 13px;
  line-height: 1.6;
}

.ct-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #2c3e50;
}

.ct-avatar {
  flex-shrink: 0;

  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #2c3e50;
  }
}

.ct-info {
  flex: 1;
}

.ct-name {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 4px;
}

.ct-title {
  font-size: 16px;
  color: #666;
  margin: 0 0 8px;
}

.ct-contact {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 12px;
  color: #555;
}

.ct-section {
  margin-bottom: 16px;
}

.ct-section-title {
  font-size: 15px;
  font-weight: 700;
  color: #2c3e50;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 4px;
}

.ct-divider {
  height: 1px;
  background: #bdc3c7;
  margin-bottom: 10px;
}

.ct-item {
  margin-bottom: 10px;
}

.ct-item-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
}

.ct-company {
  color: #666;
}

.ct-date {
  font-size: 12px;
  color: #888;
  white-space: nowrap;
}

.ct-desc {
  margin: 4px 0 0;
  color: #555;
  white-space: pre-line;
}

.ct-text {
  color: #555;
}

.ct-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.ct-skill-tag {
  background: #ecf0f1;
  color: #2c3e50;
  padding: 3px 10px;
  border-radius: 3px;
  font-size: 12px;
}

.ct-link {
  font-size: 12px;
  color: #3498db;
  text-decoration: none;
}

.ct-langs {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.ct-lang {
  color: #555;
}
</style>
