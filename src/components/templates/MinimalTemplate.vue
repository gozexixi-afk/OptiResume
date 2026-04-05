<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useResumeStore } from '@/stores/resume'

const { t } = useI18n()
const store = useResumeStore()
</script>

<template>
  <div class="minimal-template">
    <!-- Header -->
    <header class="mn-header">
      <div class="mn-header-content">
        <h1 class="mn-name">{{ store.data.personal.name || t('personal.name') }}</h1>
        <p class="mn-title" v-if="store.data.personal.title">{{ store.data.personal.title }}</p>
      </div>
      <div class="mn-contact">
        <span v-if="store.data.personal.email">{{ store.data.personal.email }}</span>
        <span v-if="store.data.personal.phone">{{ store.data.personal.phone }}</span>
        <span v-if="store.data.personal.location">{{ store.data.personal.location }}</span>
        <span v-if="store.data.personal.website">{{ store.data.personal.website }}</span>
      </div>
    </header>

    <!-- Objective -->
    <section v-if="store.data.objective" class="mn-section">
      <h2>{{ t('objective.title') }}</h2>
      <p>{{ store.data.objective }}</p>
    </section>

    <!-- Summary -->
    <section v-if="store.data.summary" class="mn-section">
      <h2>{{ t('summary.title') }}</h2>
      <div v-html="store.data.summary"></div>
    </section>

    <!-- Experience -->
    <section v-if="store.data.experience.length > 0" class="mn-section">
      <h2>{{ t('experience.title') }}</h2>
      <div v-for="exp in store.data.experience" :key="exp.id" class="mn-entry">
        <div class="mn-entry-main">
          <span class="mn-entry-title">{{ exp.position }}</span>
          <span class="mn-sep" v-if="exp.company">|</span>
          <span class="mn-entry-sub">{{ exp.company }}</span>
        </div>
        <span class="mn-entry-date">
          {{ exp.startDate }} — {{ exp.isCurrent ? t('preview.present') : exp.endDate }}
        </span>
        <p class="mn-entry-desc" v-if="exp.description">{{ exp.description }}</p>
      </div>
    </section>

    <!-- Education -->
    <section v-if="store.data.education.length > 0" class="mn-section">
      <h2>{{ t('education.title') }}</h2>
      <div v-for="edu in store.data.education" :key="edu.id" class="mn-entry">
        <div class="mn-entry-main">
          <span class="mn-entry-title">{{ edu.school }}</span>
          <span class="mn-sep" v-if="edu.degree">|</span>
          <span class="mn-entry-sub">{{ edu.degree }} {{ edu.field }}</span>
        </div>
        <span class="mn-entry-date">{{ edu.startDate }} — {{ edu.endDate }}</span>
      </div>
    </section>

    <!-- Skills -->
    <section v-if="store.data.skills.length > 0" class="mn-section">
      <h2>{{ t('skills.title') }}</h2>
      <p class="mn-skills-line">{{ store.data.skills.join('  ·  ') }}</p>
    </section>

    <!-- Projects -->
    <section v-if="store.data.projects.length > 0" class="mn-section">
      <h2>{{ t('projects.title') }}</h2>
      <div v-for="proj in store.data.projects" :key="proj.id" class="mn-entry">
        <div class="mn-entry-main">
          <span class="mn-entry-title">{{ proj.name }}</span>
          <a v-if="proj.link" :href="proj.link" class="mn-link" target="_blank">{{ proj.link }}</a>
        </div>
        <p class="mn-entry-desc" v-if="proj.description">{{ proj.description }}</p>
      </div>
    </section>

    <!-- Languages -->
    <section v-if="store.data.languages.length > 0" class="mn-section">
      <h2>{{ t('languages.title') }}</h2>
      <p class="mn-skills-line">
        <template v-for="(lang, i) in store.data.languages" :key="i">
          {{ lang.name }}<template v-if="lang.level"> ({{ t(`languages.levels.${lang.level}`) || lang.level }})</template>
          <template v-if="i < store.data.languages.length - 1">  ·  </template>
        </template>
      </p>
    </section>

    <!-- Custom -->
    <section v-for="section in store.data.customSections" :key="section.id" class="mn-section">
      <h2>{{ section.title }}</h2>
      <p>{{ section.content }}</p>
    </section>
  </div>
</template>

<style scoped lang="scss">
.minimal-template {
  padding: 40px 44px;
  font-family: 'Helvetica Neue', Arial, 'PingFang SC', sans-serif;
  color: #1a1a1a;
  font-size: 13px;
  line-height: 1.7;
}

.mn-header {
  text-align: center;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.mn-name {
  font-size: 32px;
  font-weight: 300;
  letter-spacing: 4px;
  margin: 0 0 4px;
  color: #1a1a1a;
}

.mn-title {
  font-size: 14px;
  font-weight: 400;
  color: #888;
  margin: 0 0 12px;
  letter-spacing: 2px;
}

.mn-contact {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 12px;
  color: #666;
}

.mn-section {
  margin-bottom: 18px;

  h2 {
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #1a1a1a;
    margin: 0 0 8px;
    padding-bottom: 4px;
    border-bottom: 1px solid #e0e0e0;
  }

  > p, > div {
    color: #444;
    font-size: 12.5px;
  }
}

.mn-entry {
  margin-bottom: 10px;
}

.mn-entry-main {
  display: flex;
  align-items: baseline;
  gap: 6px;
  flex-wrap: wrap;
}

.mn-entry-title {
  font-weight: 600;
  font-size: 13px;
}

.mn-sep {
  color: #ccc;
}

.mn-entry-sub {
  color: #666;
  font-size: 12.5px;
}

.mn-entry-date {
  font-size: 11.5px;
  color: #999;
}

.mn-entry-desc {
  margin: 4px 0 0;
  font-size: 12px;
  color: #555;
  white-space: pre-line;
}

.mn-skills-line {
  color: #555;
  font-size: 12.5px;
}

.mn-link {
  font-size: 11px;
  color: #666;
  text-decoration: none;
  border-bottom: 1px dotted #999;
  margin-left: auto;
}
</style>
