export interface PersonalInfo {
  name: string
  title: string
  email: string
  phone: string
  location: string
  website: string
  avatar: string
}

export interface ExperienceItem {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
  isCurrent: boolean
}

export interface EducationItem {
  id: string
  school: string
  degree: string
  field: string
  startDate: string
  endDate: string
}

export interface ProjectItem {
  id: string
  name: string
  description: string
  link: string
}

export interface LanguageItem {
  name: string
  level: string
}

export interface CustomSection {
  id: string
  title: string
  content: string
}

export interface ResumeData {
  personal: PersonalInfo
  objective: string
  summary: string
  experience: ExperienceItem[]
  education: EducationItem[]
  skills: string[]
  projects: ProjectItem[]
  languages: LanguageItem[]
  customSections: CustomSection[]
}

export type AIProvider = 'deepseek' | 'zhipu' | 'qwen' | 'wenxin' | 'moonshot' | 'openai' | 'claude'

export interface AIModelOption {
  label: string
  value: string
  provider: AIProvider
}

export interface AIConfig {
  provider: AIProvider
  model: string
  apiKey: string
  apiEndpoint: string
}

export type TemplateType = 'classic' | 'modern' | 'minimal'

export interface AppSettings {
  locale: 'zh-CN' | 'en-US'
  theme: 'light' | 'dark'
  template: TemplateType
  previewScale: number
  editorCollapsed: boolean
}
