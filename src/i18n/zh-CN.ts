export default {
  app: {
    title: 'OptiResume - 智能简历生成器',
    logo: 'OptiResume'
  },
  nav: {
    language: '语言',
    theme: '主题',
    darkMode: '深色模式',
    lightMode: '浅色模式',
    export: '导出',
    import: '导入',
    exportPDF: '导出 PDF',
    exportHTML: '导出 HTML',
    exportJSON: '导出 JSON',
    importJSON: '导入 JSON',
    reset: '重置',
    resetConfirm: '确定要重置所有数据吗？此操作不可撤销。'
  },
  editor: {
    title: '简历编辑',
    collapse: '折叠编辑区',
    expand: '展开编辑区'
  },
  personal: {
    title: '个人信息',
    name: '姓名',
    namePlaceholder: '请输入您的姓名',
    jobTitle: '职位',
    jobTitlePlaceholder: '请输入您的职位',
    email: '邮箱',
    emailPlaceholder: '请输入邮箱地址',
    phone: '电话',
    phonePlaceholder: '请输入电话号码',
    location: '所在地',
    locationPlaceholder: '例如：北京市',
    website: '个人网站',
    websitePlaceholder: '例如：https://example.com',
    avatar: '头像',
    uploadAvatar: '上传头像',
    changeAvatar: '更换头像'
  },
  objective: {
    title: '求职意向',
    placeholder: '描述您的求职意向...'
  },
  experience: {
    title: '工作经历',
    add: '添加工作经历',
    company: '公司名称',
    companyPlaceholder: '请输入公司名称',
    position: '职位名称',
    positionPlaceholder: '请输入职位名称',
    startDate: '开始时间',
    endDate: '结束时间',
    isCurrent: '至今',
    description: '工作描述',
    descriptionPlaceholder: '描述您的工作内容和成就...',
    empty: '暂无工作经历，点击添加'
  },
  education: {
    title: '教育背景',
    add: '添加教育经历',
    school: '学校名称',
    schoolPlaceholder: '请输入学校名称',
    degree: '学历',
    degreePlaceholder: '例如：本科、硕士',
    field: '专业',
    fieldPlaceholder: '请输入专业名称',
    startDate: '入学时间',
    endDate: '毕业时间',
    empty: '暂无教育经历，点击添加'
  },
  skills: {
    title: '技能列表',
    add: '添加技能',
    placeholder: '输入技能后按回车添加',
    empty: '暂无技能，输入后按回车添加'
  },
  projects: {
    title: '项目经验',
    add: '添加项目',
    name: '项目名称',
    namePlaceholder: '请输入项目名称',
    description: '项目描述',
    descriptionPlaceholder: '描述项目内容...',
    link: '项目链接',
    linkPlaceholder: '例如：https://github.com/...',
    empty: '暂无项目经验，点击添加'
  },
  languages: {
    title: '语言能力',
    add: '添加语言',
    name: '语言',
    namePlaceholder: '例如：英语',
    level: '水平',
    levelPlaceholder: '例如：流利',
    levels: {
      native: '母语',
      fluent: '流利',
      advanced: '高级',
      intermediate: '中级',
      basic: '初级'
    },
    empty: '暂无语言能力，点击添加'
  },
  summary: {
    title: '自我评价',
    placeholder: '请输入自我评价...'
  },
  customSection: {
    title: '自定义模块',
    add: '添加自定义模块',
    sectionTitle: '模块标题',
    sectionTitlePlaceholder: '请输入模块标题',
    content: '模块内容',
    contentPlaceholder: '请输入模块内容...',
    empty: '暂无自定义模块，点击添加'
  },
  preview: {
    title: '简历预览',
    template: '模板',
    templates: {
      classic: '经典模板',
      modern: '现代模板',
      minimal: '简约模板'
    },
    scale: '缩放',
    present: '至今'
  },
  ai: {
    title: 'AI 助手',
    provider: 'AI 模型',
    model: '模型版本',
    apiKey: 'API Key',
    apiKeyPlaceholder: '请输入 API Key',
    endpoint: '自定义接口',
    endpointPlaceholder: '可选，自定义 API 地址',
    optimize: '优化内容',
    optimizeDesc: 'AI 将帮您润色和优化简历内容',
    generate: '生成内容',
    generateDesc: '根据职位描述自动生成匹配内容',
    translate: '翻译',
    translateDesc: '将简历内容翻译为其他语言',
    parse: '解析简历',
    parseDesc: '粘贴已有简历文本，AI 自动解析',
    jobDescription: '职位描述',
    jobDescriptionPlaceholder: '请粘贴目标职位描述...',
    pasteResume: '粘贴简历',
    pasteResumePlaceholder: '请粘贴已有简历文本...',
    processing: 'AI 处理中...',
    success: '处理成功',
    error: '处理失败，请检查 API Key 和网络连接',
    noApiKey: '请先配置 API Key',
    configTitle: 'AI 配置',
    translateTo: '翻译目标语言',
    toEnglish: '翻译为英文',
    toChinese: '翻译为中文'
  },
  actions: {
    add: '添加',
    delete: '删除',
    edit: '编辑',
    save: '保存',
    cancel: '取消',
    confirm: '确认',
    moveUp: '上移',
    moveDown: '下移',
    preview: '预览'
  },
  messages: {
    exportSuccess: '导出成功',
    importSuccess: '导入成功',
    importError: '导入失败，请检查文件格式',
    resetSuccess: '数据已重置',
    saved: '已自动保存'
  }
}
