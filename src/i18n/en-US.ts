export default {
  app: {
    title: 'OptiResume - Smart Resume Builder',
    logo: 'OptiResume'
  },
  nav: {
    language: 'Language',
    theme: 'Theme',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    export: 'Export',
    import: 'Import',
    exportPDF: 'Export PDF',
    exportHTML: 'Export HTML',
    exportJSON: 'Export JSON',
    importJSON: 'Import JSON',
    reset: 'Reset',
    resetConfirm: 'Are you sure you want to reset all data? This action cannot be undone.',
    undo: 'Undo AI Changes'
  },
  editor: {
    title: 'Resume Editor',
    collapse: 'Collapse Editor',
    expand: 'Expand Editor',
    moduleManager: 'Section Order'
  },
  personal: {
    title: 'Personal Info',
    name: 'Name',
    namePlaceholder: 'Enter your name',
    jobTitle: 'Job Title',
    jobTitlePlaceholder: 'Enter your job title',
    email: 'Email',
    emailPlaceholder: 'Enter email address',
    phone: 'Phone',
    phonePlaceholder: 'Enter phone number',
    location: 'Location',
    locationPlaceholder: 'e.g., Beijing, China',
    website: 'Website',
    websitePlaceholder: 'e.g., https://example.com',
    avatar: 'Avatar',
    uploadAvatar: 'Upload Avatar',
    changeAvatar: 'Change Avatar'
  },
  objective: {
    title: 'Objective',
    placeholder: 'Describe your career objective...'
  },
  experience: {
    title: 'Work Experience',
    add: 'Add Experience',
    company: 'Company',
    companyPlaceholder: 'Enter company name',
    position: 'Position',
    positionPlaceholder: 'Enter position title',
    startDate: 'Start Date',
    endDate: 'End Date',
    isCurrent: 'Present',
    description: 'Description',
    descriptionPlaceholder: 'Describe your responsibilities and achievements...',
    empty: 'No experience yet, click to add'
  },
  education: {
    title: 'Education',
    add: 'Add Education',
    school: 'School',
    schoolPlaceholder: 'Enter school name',
    degree: 'Degree',
    degreePlaceholder: 'e.g., Bachelor, Master',
    field: 'Field of Study',
    fieldPlaceholder: 'Enter field of study',
    startDate: 'Start Date',
    endDate: 'End Date',
    empty: 'No education yet, click to add'
  },
  skills: {
    title: 'Skills',
    add: 'Add Skill',
    placeholder: 'Type a skill and press Enter',
    empty: 'No skills yet, type and press Enter to add'
  },
  projects: {
    title: 'Projects',
    add: 'Add Project',
    name: 'Project Name',
    namePlaceholder: 'Enter project name',
    description: 'Description',
    descriptionPlaceholder: 'Describe the project...',
    link: 'Project Link',
    linkPlaceholder: 'e.g., https://github.com/...',
    empty: 'No projects yet, click to add'
  },
  languages: {
    title: 'Languages',
    add: 'Add Language',
    name: 'Language',
    namePlaceholder: 'e.g., English',
    level: 'Level',
    levelPlaceholder: 'e.g., Fluent',
    levels: {
      native: 'Native',
      fluent: 'Fluent',
      advanced: 'Advanced',
      intermediate: 'Intermediate',
      basic: 'Basic'
    },
    empty: 'No languages yet, click to add'
  },
  summary: {
    title: 'Summary',
    placeholder: 'Enter your self summary...'
  },
  customSection: {
    title: 'Custom Sections',
    add: 'Add Custom Section',
    sectionTitle: 'Section Title',
    sectionTitlePlaceholder: 'Enter section title',
    content: 'Content',
    contentPlaceholder: 'Enter section content...',
    empty: 'No custom sections yet, click to add'
  },
  preview: {
    title: 'Resume Preview',
    template: 'Template',
    templates: {
      classic: 'Classic',
      modern: 'Modern',
      minimal: 'Minimal'
    },
    scale: 'Zoom',
    present: 'Present',
    pageCount: '{count} pages',
    pageN: 'Page {n}'
  },
  ai: {
    title: 'AI Assistant',
    provider: 'AI Provider',
    model: 'Model',
    apiKey: 'API Key',
    apiKeyPlaceholder: 'Enter API Key',
    endpoint: 'Custom Endpoint',
    endpointPlaceholder: 'Optional custom API endpoint',
    optimize: 'Optimize',
    optimizeDesc: 'AI will polish and optimize your resume',
    generate: 'Generate',
    generateDesc: 'Generate matching content based on job description',
    translate: 'Translate',
    translateDesc: 'Translate resume content to another language',
    parse: 'Parse Resume',
    parseDesc: 'Paste existing resume text for AI parsing',
    jobDescription: 'Job Description',
    jobDescriptionPlaceholder: 'Paste the target job description...',
    pasteResume: 'Paste Resume',
    pasteResumePlaceholder: 'Paste existing resume text...',
    processing: 'AI Processing...',
    success: 'Processing complete',
    error: 'Processing failed, please check API Key and network',
    noApiKey: 'Please configure API Key first',
    configTitle: 'AI Configuration',
    translateTo: 'Target Language',
    toEnglish: 'Translate to English',
    toChinese: 'Translate to Chinese'
  },
  actions: {
    add: 'Add',
    delete: 'Delete',
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    moveUp: 'Move Up',
    moveDown: 'Move Down',
    preview: 'Preview'
  },
  diff: {
    title: 'AI Result Comparison',
    before: 'Before',
    after: 'After',
    changed: 'Changed',
    unchanged: 'Unchanged',
    noChanges: 'AI output is identical to your current resume',
    changedCount: '{count} section(s) changed',
    selectedCount: '{count} selected',
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    applySelected: 'Apply Selected ({count})'
  },
  messages: {
    exportSuccess: 'Export successful',
    importSuccess: 'Import successful',
    importError: 'Import failed, please check file format',
    resetSuccess: 'Data has been reset',
    saved: 'Auto-saved',
    undoSuccess: 'Reverted to previous version'
  }
}
