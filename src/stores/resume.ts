import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { ResumeData, ExperienceItem, EducationItem, ProjectItem, LanguageItem, CustomSection } from '@/types/resume'
import { v4 as uuidv4 } from 'uuid'

const STORAGE_KEY = 'optiresume-data'

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

export const useResumeStore = defineStore('resume', () => {
  const data = ref<ResumeData>(loadFromStorage())

  watch(data, (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
  }, { deep: true })

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

  return {
    data,
    addExperience, removeExperience, moveExperience,
    addEducation, removeEducation, moveEducation,
    addProject, removeProject,
    addLanguage, removeLanguage,
    addCustomSection, removeCustomSection,
    addSkill, removeSkill,
    importData, resetData
  }
})
