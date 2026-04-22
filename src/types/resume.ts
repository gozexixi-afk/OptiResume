export interface PersonalInfo {
  name: string
  title: string
  status: string
  expectedLocation: string
  expectedSalary: string
  email: string
  phone: string
  wechat: string
  github: string
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
  major: string
  degree: string
  field: string
  startDate: string
  endDate: string
  schoolType: string
  college: string
  city: string
  campusExperience: string
}

export interface ProjectItem {
  id: string
  name: string
  role: string
  city: string
  startDate: string
  endDate: string
  description: string
  link: string
}

export interface SkillItem {
  id: string
  name: string
  description: string
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
  skills: SkillItem[]
  projects: ProjectItem[]
  languages: LanguageItem[]
  customSections: CustomSection[]
}

export type ResumeSectionKey =
  | 'personal'
  | 'objective'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'languages'
  | 'customSections'

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

export type InfoDisplayMode = 'text' | 'icon' | 'pure'
export type HeaderAlignMode = 'left' | 'center' | 'right' | 'justify'

export interface LayoutSettings {
  fontFamily: string
  fontSize: number
  lineHeight: number
  themeColor: string
  headerAlign: HeaderAlignMode
  infoDisplay: InfoDisplayMode
  pagePaddingTop: number
  pagePaddingRight: number
  pagePaddingBottom: number
  pagePaddingLeft: number
  sectionSpacing: number
  titleMarginTop: number
  titleMarginBottom: number
}

export interface AppSettings {
  locale: 'zh-CN' | 'en-US'
  theme: 'light' | 'dark'
  template: TemplateType
  previewScale: number
  editorCollapsed: boolean
  layout: LayoutSettings
}
