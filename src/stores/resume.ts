import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { ResumeData, ResumeSectionKey } from '@/types/resume'
import { v4 as uuidv4 } from 'uuid'

const STORAGE_KEY = 'optiresume-data'
const SECTION_ORDER_KEY = 'optiresume-section-order'
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
      email: '',
      phone: '',
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
      return { ...createDefaultResume(), ...parsed }
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

export const useResumeStore = defineStore('resume', () => {
  const data = ref<ResumeData>(loadFromStorage())
  const sectionOrder = ref<ResumeSectionKey[]>(loadSectionOrder())
  const history = ref<ResumeData[]>([])
  const canUndo = computed(() => history.value.length > 0)

  watch(data, (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
  }, { deep: true })
  watch(sectionOrder, (val) => {
    localStorage.setItem(SECTION_ORDER_KEY, JSON.stringify(val))
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
      degree: '',
      field: '',
      startDate: '',
      endDate: ''
    })
  }

  function removeEducation(id: string) {
    data.value.education = data.value.education.filter(e => e.id !== id)
  }

  function addProject() {
    data.value.projects.push({
      id: uuidv4(),
      name: '',
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

  function addSkill(skill: string) {
    if (skill && !data.value.skills.includes(skill)) {
      data.value.skills.push(skill)
    }
  }

  function removeSkill(index: number) {
    data.value.skills.splice(index, 1)
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

  function hasSection(section: ResumeSectionKey): boolean {
    return sectionOrder.value.includes(section)
  }

  return {
    data,
    sectionOrder,
    history,
    canUndo,
    pushHistory,
    undo,
    addExperience, removeExperience, moveExperience,
    addEducation, removeEducation, moveEducation,
    addProject, removeProject,
    addLanguage, removeLanguage,
    addCustomSection, removeCustomSection,
    addSkill, removeSkill,
    moveSection, removeSection, hasSection,
    importData, resetData
  }
})
