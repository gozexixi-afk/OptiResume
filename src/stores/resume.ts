import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { ResumeData, ResumeSectionKey, SkillItem } from '@/types/resume'
import { v4 as uuidv4 } from 'uuid'

const STORAGE_KEY = 'optiresume-data'
const SECTION_ORDER_KEY = 'optiresume-section-order'
const SECTION_TITLE_KEY = 'optiresume-section-title-overrides'
const MAX_HISTORY = 20
const DEFAULT_SECTION_ORDER: ResumeSectionKey[] = [
  'personal',
  'objective',
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'languages',
  'customSections'
]

function createDefaultResume(): ResumeData {
  return {
    personal: {
      name: '',
      title: '',
      status: '',
      expectedLocation: '',
      expectedSalary: '',
      email: '',
      phone: '',
      wechat: '',
      github: '',
      location: '',
      website: '',
      avatar: ''
    },
    objective: '',
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    languages: [],
    customSections: []
  }
}

function loadFromStorage(): ResumeData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      const merged = { ...createDefaultResume(), ...parsed }
      if (Array.isArray(merged.skills) && merged.skills.length && typeof merged.skills[0] === 'string') {
        merged.skills = (merged.skills as string[]).map((name) => ({
          id: uuidv4(),
          name,
          description: ''
        }))
      }
      return merged
    }
  } catch { /* ignore */ }
  return createDefaultResume()
}

function loadSectionOrder(): ResumeSectionKey[] {
  try {
    const raw = localStorage.getItem(SECTION_ORDER_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        const filtered = parsed.filter((item): item is ResumeSectionKey => DEFAULT_SECTION_ORDER.includes(item))
        if (filtered.length > 0) return filtered
      }
    }
  } catch { /* ignore */ }
  return [...DEFAULT_SECTION_ORDER]
}

function loadSectionTitleOverrides(): Partial<Record<ResumeSectionKey, string>> {
  try {
    const raw = localStorage.getItem(SECTION_TITLE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Record<string, string>
      const result: Partial<Record<ResumeSectionKey, string>> = {}
      for (const key of DEFAULT_SECTION_ORDER) {
        if (typeof parsed[key] === 'string') result[key] = parsed[key]
      }
      return result
    }
  } catch { /* ignore */ }
  return {}
}

export const useResumeStore = defineStore('resume', () => {
  const data = ref<ResumeData>(loadFromStorage())
  const sectionOrder = ref<ResumeSectionKey[]>(loadSectionOrder())
  const sectionTitleOverrides = ref<Partial<Record<ResumeSectionKey, string>>>(loadSectionTitleOverrides())
  const history = ref<ResumeData[]>([])
  const canUndo = computed(() => history.value.length > 0)

  watch(data, (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
  }, { deep: true })
  watch(sectionOrder, (val) => {
    localStorage.setItem(SECTION_ORDER_KEY, JSON.stringify(val))
  }, { deep: true })
  watch(sectionTitleOverrides, (val) => {
    localStorage.setItem(SECTION_TITLE_KEY, JSON.stringify(val))
  }, { deep: true })

  function pushHistory() {
    history.value.push(JSON.parse(JSON.stringify(data.value)))
    if (history.value.length > MAX_HISTORY) history.value.shift()
  }

  function undo(): boolean {
    if (!history.value.length) return false
    data.value = history.value.pop()!
    return true
  }

  function addExperience() {
    data.value.experience.push({
      id: uuidv4(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
      isCurrent: false
    })
  }

  function removeExperience(id: string) {
    data.value.experience = data.value.experience.filter(e => e.id !== id)
  }

  function addEducation() {
    data.value.education.push({
      id: uuidv4(),
      school: '',
      major: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      schoolType: '',
      college: '',
      city: '',
      campusExperience: ''
    })
  }

  function removeEducation(id: string) {
    data.value.education = data.value.education.filter(e => e.id !== id)
  }

  function addProject() {
    data.value.projects.push({
      id: uuidv4(),
      name: '',
      role: '',
      city: '',
      startDate: '',
      endDate: '',
      description: '',
      link: ''
    })
  }

  function removeProject(id: string) {
    data.value.projects = data.value.projects.filter(p => p.id !== id)
  }

  function addLanguage() {
    data.value.languages.push({ name: '', level: '' })
  }

  function removeLanguage(index: number) {
    data.value.languages.splice(index, 1)
  }

  function addCustomSection() {
    data.value.customSections.push({
      id: uuidv4(),
      title: '',
      content: ''
    })
  }

  function removeCustomSection(id: string) {
    data.value.customSections = data.value.customSections.filter(s => s.id !== id)
  }

  function addSkill() {
    data.value.skills.push({
      id: uuidv4(),
      name: '',
      description: ''
    })
  }

  function removeSkill(id: string) {
    data.value.skills = data.value.skills.filter(skill => skill.id !== id)
  }

  function normalizeSkills(skills: SkillItem[]) {
    data.value.skills = skills.map(item => ({
      id: item.id || uuidv4(),
      name: item.name || '',
      description: item.description || ''
    }))
  }

  function importData(newData: ResumeData) {
    data.value = { ...createDefaultResume(), ...newData }
  }

  function resetData() {
    data.value = createDefaultResume()
    sectionOrder.value = [...DEFAULT_SECTION_ORDER]
  }

  function moveItem<T>(arr: T[], from: number, to: number) {
    if (to < 0 || to >= arr.length) return
    const item = arr.splice(from, 1)[0]
    arr.splice(to, 0, item)
  }

  function moveExperience(from: number, to: number) {
    moveItem(data.value.experience, from, to)
  }

  function moveEducation(from: number, to: number) {
    moveItem(data.value.education, from, to)
  }

  function moveSection(from: number, to: number) {
    moveItem(sectionOrder.value, from, to)
  }

  function removeSection(section: ResumeSectionKey) {
    if (sectionOrder.value.length <= 1) return
    sectionOrder.value = sectionOrder.value.filter(item => item !== section)
  }

  function restoreSection(section: ResumeSectionKey) {
    if (sectionOrder.value.includes(section)) return
    const targetIndex = DEFAULT_SECTION_ORDER.indexOf(section)
    if (targetIndex < 0) return

    let insertAt = sectionOrder.value.length
    for (let i = 0; i < sectionOrder.value.length; i++) {
      const current = sectionOrder.value[i]
      if (DEFAULT_SECTION_ORDER.indexOf(current) > targetIndex) {
        insertAt = i
        break
      }
    }
    sectionOrder.value.splice(insertAt, 0, section)
  }

  function hasSection(section: ResumeSectionKey): boolean {
    return sectionOrder.value.includes(section)
  }

  function getSectionTitle(section: ResumeSectionKey, fallback: string): string {
    const custom = sectionTitleOverrides.value[section]?.trim()
    return custom || fallback
  }

  function setSectionTitle(section: ResumeSectionKey, title: string) {
    const trimmed = title.trim()
    if (!trimmed) {
      delete sectionTitleOverrides.value[section]
      return
    }
    sectionTitleOverrides.value[section] = trimmed
  }

  return {
    data,
    sectionOrder,
    sectionTitleOverrides,
    history,
    canUndo,
    pushHistory,
    undo,
    addExperience, removeExperience, moveExperience,
    addEducation, removeEducation, moveEducation,
    addProject, removeProject,
    addLanguage, removeLanguage,
    addCustomSection, removeCustomSection,
    addSkill, removeSkill, normalizeSkills,
    moveSection, removeSection, restoreSection, hasSection,
    getSectionTitle, setSectionTitle,
    importData, resetData
  }
})
