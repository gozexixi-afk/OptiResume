<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useResumeStore } from '@/stores/resume'
import type { ResumeSectionKey } from '@/types/resume'

const { t } = useI18n()
const store = useResumeStore()
const orderedSections = computed(() => store.sectionOrder.filter(key => key !== 'personal'))

function isHtmlContent(text: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(text)
}

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
  <div class="modern-template">
    <!-- Sidebar -->
    <aside class="mt-sidebar">
      <div class="mt-avatar" v-if="store.hasSection('personal') && store.data.personal.avatar">
        <img :src="store.data.personal.avatar" alt="avatar" />
      </div>
      <div v-if="store.hasSection('personal')" class="mt-name-block">
        <h1 class="mt-name">{{ store.data.personal.name || t('personal.name') }}</h1>
        <p class="mt-title" v-if="store.data.personal.title">{{ store.data.personal.title }}</p>
      </div>

      <div v-if="store.hasSection('personal')" class="mt-sidebar-section">
        <h3 class="mt-sidebar-title">{{ t('personal.title') }}</h3>
        <ul class="mt-contact-list">
          <li v-if="store.data.personal.email">{{ store.data.personal.email }}</li>
          <li v-if="store.data.personal.phone">{{ store.data.personal.phone }}</li>
          <li v-if="store.data.personal.location">{{ store.data.personal.location }}</li>
          <li v-if="store.data.personal.website">{{ store.data.personal.website }}</li>
        </ul>
      </div>

    </aside>

    <main class="mt-main">
      <template v-for="section in orderedSections" :key="section">
        <section v-if="section === 'objective' && isSectionVisible(section)" class="mt-section">
          <h2 class="mt-section-title">{{ t('objective.title') }}</h2>
          <div v-if="isHtmlContent(store.data.objective)" class="mt-rich-text" v-html="store.data.objective"></div>
          <p v-else>{{ store.data.objective }}</p>
        </section>

        <section v-else-if="section === 'summary' && isSectionVisible(section)" class="mt-section">
          <h2 class="mt-section-title">{{ t('summary.title') }}</h2>
          <div v-html="store.data.summary"></div>
        </section>

        <section v-else-if="section === 'experience' && isSectionVisible(section)" class="mt-section">
          <h2 class="mt-section-title">{{ t('experience.title') }}</h2>
          <div v-for="exp in store.data.experience" :key="exp.id" class="mt-item">
            <div class="mt-item-dot"></div>
            <div class="mt-item-content">
              <div class="mt-item-header">
                <h3>{{ exp.position }}</h3>
                <span class="mt-date">
                  {{ exp.startDate }} - {{ exp.isCurrent ? t('preview.present') : exp.endDate }}
                </span>
              </div>
              <p class="mt-company" v-if="exp.company">{{ exp.company }}</p>
              <div v-if="exp.description && isHtmlContent(exp.description)" class="mt-desc mt-rich-text" v-html="exp.description"></div>
              <p class="mt-desc" v-else-if="exp.description">{{ exp.description }}</p>
            </div>
          </div>
        </section>

        <section v-else-if="section === 'education' && isSectionVisible(section)" class="mt-section">
          <h2 class="mt-section-title">{{ store.getSectionTitle('education', t('education.title')) }}</h2>
          <div v-for="edu in store.data.education" :key="edu.id" class="mt-item">
            <div class="mt-item-dot"></div>
            <div class="mt-item-content">
              <div class="mt-item-header">
                <h3>{{ edu.school }}</h3>
                <span class="mt-date">{{ edu.startDate }} - {{ edu.endDate }}</span>
              </div>
              <p class="mt-company" v-if="edu.major || edu.degree">{{ edu.major || edu.field }} · {{ edu.degree }}</p>
            </div>
          </div>
        </section>

        <section v-else-if="section === 'skills' && isSectionVisible(section)" class="mt-section">
          <h2 class="mt-section-title">{{ store.getSectionTitle('skills', t('skills.title')) }}</h2>
          <div class="mt-skills">
            <span v-for="(skill, i) in store.data.skills" :key="skill.id || i" class="mt-skill">{{ skill.name }}</span>
          </div>
        </section>

        <section v-else-if="section === 'projects' && isSectionVisible(section)" class="mt-section">
          <h2 class="mt-section-title">{{ store.getSectionTitle('projects', t('projects.title')) }}</h2>
          <div v-for="proj in store.data.projects" :key="proj.id" class="mt-item">
            <div class="mt-item-dot"></div>
            <div class="mt-item-content">
              <h3>{{ proj.name }}</h3>
              <p class="mt-company" v-if="proj.role || proj.city">{{ [proj.role, proj.city].filter(Boolean).join(' · ') }}</p>
              <p class="mt-date" v-if="proj.startDate || proj.endDate">{{ proj.startDate }} - {{ proj.endDate }}</p>
              <div v-if="proj.description && isHtmlContent(proj.description)" class="mt-desc mt-rich-text" v-html="proj.description"></div>
              <p class="mt-desc" v-else-if="proj.description">{{ proj.description }}</p>
              <a v-if="proj.link" :href="proj.link" class="mt-link" target="_blank">{{ proj.link }}</a>
            </div>
          </div>
        </section>

        <section v-else-if="section === 'languages' && isSectionVisible(section)" class="mt-section">
          <h2 class="mt-section-title">{{ t('languages.title') }}</h2>
          <div class="mt-lang-list">
            <div v-for="(lang, i) in store.data.languages" :key="i" class="mt-lang-item">
              <span>{{ lang.name }}</span>
              <span class="mt-lang-level">{{ lang.level ? (t(`languages.levels.${lang.level}`) || lang.level) : '' }}</span>
            </div>
          </div>
        </section>

        <template v-else-if="section === 'customSections' && isSectionVisible(section)">
          <section v-for="custom in store.data.customSections" :key="custom.id" class="mt-section">
            <h2 class="mt-section-title">{{ custom.title }}</h2>
            <div v-if="isHtmlContent(custom.content)" class="mt-rich-text" v-html="custom.content"></div>
            <p v-else>{{ custom.content }}</p>
          </section>
        </template>
      </template>
    </main>
  </div>
</template>

<style scoped lang="scss">
.modern-template {
  display: flex;
  min-height: 297mm;
  font-family: 'Segoe UI', 'PingFang SC', sans-serif;
  font-size: 13px;
  line-height: 1.6;
  color: #333;
}

.mt-sidebar {
  width: 220px;
  background: #1a365d;
  color: #e2e8f0;
  padding: 28px 20px;
  flex-shrink: 0;
}

.mt-avatar {
  text-align: center;
  margin-bottom: 16px;

  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid rgba(255, 255, 255, 0.3);
  }
}

.mt-name-block {
  text-align: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.mt-name {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 4px;
}

.mt-title {
  font-size: 13px;
  color: #a0aec0;
  margin: 0;
}

.mt-sidebar-section {
  margin-bottom: 20px;
}

.mt-sidebar-title {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #90cdf4;
  margin: 0 0 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}

.mt-contact-list {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    font-size: 11px;
    margin-bottom: 6px;
    word-break: break-all;
    color: #cbd5e0;
  }
}

.mt-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.mt-skill {
  background: rgba(255, 255, 255, 0.15);
  color: #e2e8f0;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
}

.mt-lang-item {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 4px;
}

.mt-lang-level {
  color: #a0aec0;
  font-size: 11px;
}

.mt-main {
  flex: 1;
  padding: 28px 30px;
}

.mt-section {
  margin-bottom: 18px;
}

.mt-section-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a365d;
  margin: 0 0 10px;
  padding-bottom: 6px;
  border-bottom: 2px solid #3182ce;
}

.mt-item {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  position: relative;
}

.mt-item-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #3182ce;
  margin-top: 7px;
  flex-shrink: 0;
}

.mt-item-content {
  flex: 1;
}

.mt-item-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;

  h3 {
    font-size: 14px;
    font-weight: 600;
    margin: 0;
    color: #2d3748;
  }
}

.mt-date {
  font-size: 12px;
  color: #718096;
  white-space: nowrap;
}

.mt-company {
  font-size: 12px;
  color: #718096;
  margin: 2px 0 4px;
}

.mt-desc {
  font-size: 12px;
  color: #4a5568;
  margin: 4px 0 0;
  white-space: pre-line;
}

.mt-link {
  font-size: 11px;
  color: #3182ce;
  text-decoration: none;
}

.mt-rich-text {
  :deep(p) {
    margin: 0 0 6px;
  }
  :deep(ul), :deep(ol) {
    margin: 0;
    padding-left: 18px;
  }
}
</style>
