<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useResumeStore } from '@/stores/resume'
import { useSettingsStore } from '@/stores/settings'
import type { ResumeSectionKey } from '@/types/resume'

const { t } = useI18n()
const store = useResumeStore()
const settingsStore = useSettingsStore()
const orderedSections = computed(() => store.sectionOrder.filter(key => key !== 'personal'))

function splitToBulletLines(text: string): string[] {
  return text
    .split('\n')
    .map(line => line.trim().replace(/^[•·\-]\s*/, ''))
    .filter(Boolean)
}

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

const headerAlignClass = computed(() => `ct-align-${settingsStore.settings.layout.headerAlign}`)

const contactList = computed(() => {
  const p = store.data.personal
  const info = [
    { key: 'phone', value: p.phone, icon: '☎' },
    { key: 'email', value: p.email, icon: '✉' },
    { key: 'wechat', value: p.wechat, icon: '💬' },
    { key: 'github', value: p.github, icon: '⌘' },
    { key: 'location', value: p.location, icon: '⌂' },
    { key: 'website', value: p.website, icon: '🔗' }
  ]
  return info.filter(item => !!item.value)
})
</script>

<template>
  <div class="classic-template">
    <header v-if="store.hasSection('personal')" class="ct-header" :class="headerAlignClass">
      <div class="ct-info">
        <h1 class="ct-name">{{ store.data.personal.name || t('personal.name') }}</h1>
        <p class="ct-title" v-if="store.data.personal.title">{{ store.data.personal.title }}</p>
        <div class="ct-contact">
          <span v-for="item in contactList" :key="item.key">
            <template v-if="settingsStore.settings.layout.infoDisplay === 'icon'">
              {{ item.icon }} {{ item.value }}
            </template>
            <template v-else-if="settingsStore.settings.layout.infoDisplay === 'text'">
              {{ t(`personal.${item.key}`) }}: {{ item.value }}
            </template>
            <template v-else>
              {{ item.value }}
            </template>
          </span>
        </div>
      </div>
      <div class="ct-avatar" v-if="store.data.personal.avatar">
        <img :src="store.data.personal.avatar" alt="avatar" />
      </div>
    </header>

    <template v-for="section in orderedSections" :key="section">
      <section v-if="section === 'objective' && isSectionVisible(section)" class="ct-section">
        <h2 class="ct-section-title">{{ t('objective.title') }}</h2>
        <div class="ct-divider"></div>
        <div v-if="isHtmlContent(store.data.objective)" class="ct-rich-text" v-html="store.data.objective"></div>
        <p v-else class="ct-text">{{ store.data.objective }}</p>
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
              <strong class="ct-main-title">{{ exp.position }}</strong>
              <span class="ct-company" v-if="exp.company">{{ exp.company }}</span>
            </div>
            <span class="ct-date">
              {{ exp.startDate }} - {{ exp.isCurrent ? t('preview.present') : exp.endDate }}
            </span>
          </div>
          <div
            v-if="exp.description && isHtmlContent(exp.description)"
            class="ct-rich-text"
            v-html="exp.description"
          ></div>
          <ul v-else-if="exp.description" class="ct-bullets">
            <li v-for="(line, idx) in splitToBulletLines(exp.description)" :key="idx">{{ line }}</li>
          </ul>
        </div>
      </section>

      <section v-else-if="section === 'education' && isSectionVisible(section)" class="ct-section">
        <h2 class="ct-section-title">{{ store.getSectionTitle('education', t('education.title')) }}</h2>
        <div class="ct-divider"></div>
        <div v-for="edu in store.data.education" :key="edu.id" class="ct-item">
          <div class="ct-item-header">
            <div>
              <strong class="ct-main-title">{{ edu.school }}</strong>
              <span class="ct-company" v-if="edu.major || edu.degree">{{ edu.major || edu.field }} {{ edu.degree }}</span>
            </div>
            <span class="ct-date">{{ edu.startDate }} - {{ edu.endDate }}</span>
          </div>
          <p class="ct-text" v-if="edu.schoolType || edu.college || edu.city">
            {{ [edu.schoolType, edu.college, edu.city].filter(Boolean).join(' · ') }}
          </p>
          <div
            v-if="edu.campusExperience && isHtmlContent(edu.campusExperience)"
            class="ct-rich-text"
            v-html="edu.campusExperience"
          ></div>
          <ul v-else-if="edu.campusExperience" class="ct-bullets">
            <li v-for="(line, idx) in splitToBulletLines(edu.campusExperience)" :key="idx">{{ line }}</li>
          </ul>
        </div>
      </section>

      <section v-else-if="section === 'skills' && isSectionVisible(section)" class="ct-section">
        <h2 class="ct-section-title">{{ store.getSectionTitle('skills', t('skills.title')) }}</h2>
        <div class="ct-divider"></div>
        <ul class="ct-bullets">
          <li v-for="(skill, i) in store.data.skills" :key="skill.id || i">
            <span class="ct-main-title">{{ skill.name }}</span>
            <template v-if="skill.description">
              ：<span v-if="!isHtmlContent(skill.description)">{{ skill.description }}</span>
            </template>
            <div v-if="skill.description && isHtmlContent(skill.description)" class="ct-rich-text" v-html="skill.description"></div>
          </li>
        </ul>
      </section>

      <section v-else-if="section === 'projects' && isSectionVisible(section)" class="ct-section">
        <h2 class="ct-section-title">{{ store.getSectionTitle('projects', t('projects.title')) }}</h2>
        <div class="ct-divider"></div>
        <div v-for="proj in store.data.projects" :key="proj.id" class="ct-item">
          <div class="ct-item-header">
            <div>
              <strong class="ct-main-title">{{ proj.name }}</strong>
              <span class="ct-company" v-if="proj.role || proj.city">{{ [proj.role, proj.city].filter(Boolean).join(' · ') }}</span>
            </div>
            <a v-if="proj.link" :href="proj.link" class="ct-link" target="_blank">{{ proj.link }}</a>
          </div>
          <p class="ct-text" v-if="proj.startDate || proj.endDate">{{ proj.startDate }} - {{ proj.endDate }}</p>
          <div
            v-if="proj.description && isHtmlContent(proj.description)"
            class="ct-rich-text"
            v-html="proj.description"
          ></div>
          <ul v-else-if="proj.description" class="ct-bullets">
            <li v-for="(line, idx) in splitToBulletLines(proj.description)" :key="idx">{{ line }}</li>
          </ul>
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
          <div
            v-if="custom.content && isHtmlContent(custom.content)"
            class="ct-rich-text"
            v-html="custom.content"
          ></div>
          <ul v-else class="ct-bullets">
            <li v-for="(line, idx) in splitToBulletLines(custom.content)" :key="idx">{{ line }}</li>
          </ul>
        </section>
      </template>
    </template>
  </div>
</template>

<style scoped lang="scss">
.classic-template {
  padding: var(--or-page-padding-top, 28px) var(--or-page-padding-right, 34px)
    var(--or-page-padding-bottom, 28px) var(--or-page-padding-left, 34px);
  font-family: var(--or-resume-font-family, 'PingFang SC', 'Microsoft YaHei', sans-serif);
  color: var(--or-theme-color, #1f1f1f);
  font-size: var(--or-resume-font-size, 13px);
  line-height: var(--or-resume-line-height, 1.5);
}

.ct-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 14px;
}

.ct-align-left {
  text-align: left;
}

.ct-align-center {
  text-align: center;
  .ct-contact {
    justify-content: center;
  }
}

.ct-align-right {
  text-align: right;
  .ct-contact {
    justify-content: flex-end;
  }
}

.ct-align-justify {
  .ct-info {
    width: 100%;
  }
  .ct-contact {
    justify-content: space-between;
  }
}

.ct-avatar {
  flex-shrink: 0;

  img {
    width: 72px;
    height: 92px;
    border-radius: 2px;
    object-fit: cover;
    border: 1px solid #ddd;
  }
}

.ct-info {
  flex: 1;
}

.ct-name {
  font-size: 32px;
  font-weight: 700;
  color: #111;
  margin: 0 0 4px;
  letter-spacing: 1px;
}

.ct-title {
  font-size: 15px;
  color: #222;
  margin: 0 0 6px;
  font-weight: 600;
}

.ct-contact {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 12px;
  color: #2f2f2f;

  span:not(:last-child)::after {
    content: '  |';
    color: #777;
    margin-left: 8px;
  }
}

.ct-section {
  margin-bottom: var(--or-section-spacing, 12px);
}

.ct-section-title {
  font-size: 20px;
  font-weight: 700;
  color: #111;
  margin: var(--or-title-margin-top, 0) 0 var(--or-title-margin-bottom, 6px);
}

.ct-divider {
  height: 1px;
  background: #111;
  margin-bottom: 8px;
}

.ct-item {
  margin-bottom: 8px;
}

.ct-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 3px;
  gap: 8px;
}

.ct-main-title {
  font-size: 15px;
  font-weight: 700;
}

.ct-company {
  color: #3a3a3a;
  margin-left: 8px;
  font-size: 13px;
}

.ct-date {
  font-size: 12px;
  color: #444;
  white-space: nowrap;
}

.ct-desc {
  margin: 4px 0 0;
  color: #555;
  white-space: pre-line;
}

.ct-text {
  color: #2f2f2f;
}

.ct-bullets {
  margin: 0;
  padding-left: 18px;

  li {
    margin-bottom: 2px;
    color: #2f2f2f;
    white-space: pre-line;
  }
}

.ct-rich-text {
  color: #2f2f2f;

  :deep(p) {
    margin: 0 0 4px;
  }

  :deep(ul), :deep(ol) {
    margin: 0;
    padding-left: 18px;
  }

  :deep(li) {
    margin-bottom: 2px;
  }
}

.ct-link {
  font-size: 12px;
  color: #444;
  text-decoration: none;
}

.ct-langs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.ct-lang {
  color: #333;
}
</style>
