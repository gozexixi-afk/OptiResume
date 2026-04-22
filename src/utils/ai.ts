import { jsonrepair } from 'jsonrepair'
import type { AIConfig, AIModelOption, AIProvider, ResumeData } from '@/types/resume'

/**
 * 构造发给 AI 的 userMessage 用简历数据：不包含头像 base64，避免 body 过大、浪费 token 与截断。
 */
export function resumeDataForAiUserMessage(data: ResumeData): ResumeData {
  return {
    ...data,
    personal: {
      ...data.personal,
      avatar: ''
    }
  }
}

/** 开发环境通过 Vite 代理访问，见 vite.config.ts `/api/deepseek` */
function deepseekChatUrl(explicit?: string): string {
  if (explicit?.trim()) return explicit.trim()
  if (import.meta.env.DEV) {
    return '/api/deepseek/v1/chat/completions'
  }
  return 'https://api.deepseek.com/v1/chat/completions'
}

export const AI_PROVIDERS: { label: string; value: AIProvider }[] = [
  { label: 'DeepSeek', value: 'deepseek' },
  { label: '智谱 AI (GLM)', value: 'zhipu' },
  { label: '通义千问', value: 'qwen' },
  { label: '文心一言', value: 'wenxin' },
  { label: 'Moonshot (Kimi)', value: 'moonshot' },
  { label: 'OpenAI', value: 'openai' },
  { label: 'Claude', value: 'claude' }
]

// 与 https://api-docs.deepseek.com/zh-cn/ 一致：deepseek-chat / deepseek-reasoner 为 V3.2
export const AI_MODELS: Record<AIProvider, AIModelOption[]> = {
  deepseek: [
    { label: 'DeepSeek Chat (V3.2)', value: 'deepseek-chat', provider: 'deepseek' },
    { label: 'DeepSeek Reasoner (V3.2)', value: 'deepseek-reasoner', provider: 'deepseek' }
  ],
  zhipu: [
    { label: 'GLM-4', value: 'glm-4', provider: 'zhipu' },
    { label: 'GLM-4-Flash', value: 'glm-4-flash', provider: 'zhipu' }
  ],
  qwen: [
    { label: 'Qwen Turbo', value: 'qwen-turbo', provider: 'qwen' },
    { label: 'Qwen Plus', value: 'qwen-plus', provider: 'qwen' }
  ],
  wenxin: [
    { label: 'ERNIE-Bot', value: 'ernie-bot', provider: 'wenxin' }
  ],
  moonshot: [
    { label: 'Moonshot v1-8k', value: 'moonshot-v1-8k', provider: 'moonshot' },
    { label: 'Moonshot v1-32k', value: 'moonshot-v1-32k', provider: 'moonshot' }
  ],
  openai: [
    { label: 'GPT-4', value: 'gpt-4', provider: 'openai' },
    { label: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo', provider: 'openai' }
  ],
  claude: [
    { label: 'Claude 3.5 Sonnet', value: 'claude-3-5-sonnet-20241022', provider: 'claude' },
    { label: 'Claude 3 Haiku', value: 'claude-3-haiku-20240307', provider: 'claude' }
  ]
}

const API_ENDPOINTS: Record<AIProvider, string> = {
  deepseek: 'https://api.deepseek.com/v1/chat/completions',
  zhipu: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
  qwen: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
  wenxin: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions',
  moonshot: 'https://api.moonshot.cn/v1/chat/completions',
  openai: 'https://api.openai.com/v1/chat/completions',
  claude: 'https://api.anthropic.com/v1/messages'
}

function parseOpenAICompatibleError(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') return undefined
  const d = data as { error?: { message?: string }; message?: string }
  return d.error?.message || d.message
}

export async function callAI(config: AIConfig, systemPrompt: string, userMessage: string): Promise<string> {
  const endpoint =
    config.provider === 'deepseek'
      ? deepseekChatUrl(config.apiEndpoint)
      : config.apiEndpoint || API_ENDPOINTS[config.provider]

  if (config.provider === 'claude') {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: 8192,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }]
      })
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new Error(parseOpenAICompatibleError(data) || `HTTP ${response.status}`)
    }
    if (data.error) throw new Error(data.error.message)
    return data.content?.[0]?.text || ''
  }

  const body = {
    model: config.model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ],
    temperature: 0.7,
    // 简历 JSON 体积大，过小易被截断导致 Unterminated string
    max_tokens: 8192,
    stream: false as const
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`
    },
    body: JSON.stringify(body)
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const msg = parseOpenAICompatibleError(data) || `HTTP ${response.status}`
    throw new Error(msg)
  }
  if (data.error) {
    throw new Error(data.error.message || JSON.stringify(data.error))
  }
  return data.choices?.[0]?.message?.content?.trim() || ''
}

/** 提示模型勿使用 fenced code block，避免前端解析失败 */
const JSON_OUTPUT_RULE =
  '【重要】只输出一段可被 JSON.parse 解析的纯文本：不要使用 Markdown 代码块包裹，不要写任何前言或后记。' +
  '【JSON 语法】所有键名必须使用双引号；字符串值内禁止出现未转义的换行，换行必须写成 \\n；' +
  '字符串内的双引号必须写成 \\"；summary 等富文本若为 HTML，请保持为单行或正确使用 \\n 转义。'

/**
 * 从模型回复中剥离 JSON 字符串（处理 ```json 围栏、未闭合围栏、前后说明等）
 */
export function extractJsonStringFromAi(text: string): string {
  let s = text.trim().replace(/^\uFEFF/, '')
  if (!s) return s

  if (s.startsWith('```')) {
    s = s.replace(/^```(?:json)?\s*/i, '')
    const close = s.lastIndexOf('```')
    if (close !== -1) s = s.slice(0, close)
    s = s.trim()
    if (s.startsWith('{') || s.startsWith('[')) return s
  }

  const fenceAt = s.search(/```(?:json)?/i)
  if (fenceAt !== -1) {
    let inner = s.slice(fenceAt).replace(/^```(?:json)?\s*/i, '')
    const close = inner.lastIndexOf('```')
    if (close !== -1) inner = inner.slice(0, close)
    inner = inner.trim()
    if (inner.startsWith('{') || inner.startsWith('[')) return inner
  }

  const i0 = s.indexOf('{')
  const i1 = s.lastIndexOf('}')
  if (i0 !== -1 && i1 > i0) return s.slice(i0, i1 + 1)

  const a0 = s.indexOf('[')
  const a1 = s.lastIndexOf(']')
  if (a0 !== -1 && a1 > a0) return s.slice(a0, a1 + 1)

  return s.trim()
}

function normalizeSmartQuotes(s: string): string {
  return s.replace(/[\u201C\u201D\u2018\u2019]/g, (ch) =>
    ch === '\u201C' || ch === '\u201D' ? '"' : "'"
  )
}

export function parseAIJsonResponse<T = unknown>(text: string): T {
  const raw = extractJsonStringFromAi(text)

  const attempts: Array<() => string> = [
    () => raw,
    () => normalizeSmartQuotes(raw),
    () => jsonrepair(raw),
    () => jsonrepair(normalizeSmartQuotes(raw))
  ]

  let lastErr: Error | undefined
  for (const build of attempts) {
    try {
      return JSON.parse(build()) as T
    } catch (e) {
      lastErr = e as Error
    }
  }

  const preview = raw.slice(0, 280).replace(/\s+/g, ' ')
  throw new Error(
    (lastErr?.message || 'JSON 解析失败') +
    ' | 片段: ' +
    preview +
    (raw.length > 280 ? '…' : '')
  )
}

export const AI_PROMPTS = {
  optimize: `你是一个专业的简历优化专家。请优化以下简历内容，使其更加专业、有吸引力，同时保持真实性。
请直接返回优化后的 JSON 格式数据，保持与输入相同的 JSON 结构。
${JSON_OUTPUT_RULE}`,

  generate: `你是一个专业的简历撰写专家。根据以下职位描述，帮助生成匹配的简历内容。
请返回 JSON 格式的简历数据，包含以下字段：objective（求职意向）、summary（自我评价）、skills（技能列表，对象数组，每项含 name/description）。
${JSON_OUTPUT_RULE}`,

  translate_en: `你是一个专业翻译。请将以下简历内容翻译为英文。
请直接返回翻译后的 JSON 格式数据，保持与输入完全相同的 JSON 结构。
${JSON_OUTPUT_RULE}`,

  translate_zh: `你是一个专业翻译。请将以下简历内容翻译为中文。
请直接返回翻译后的 JSON 格式数据，保持与输入完全相同的 JSON 结构。
${JSON_OUTPUT_RULE}`,

  parse: `你是一个简历解析专家。请将以下简历文本解析为结构化的 JSON 数据。
JSON 结构如下：
{
  "personal": { "name": "", "title": "", "status": "", "expectedLocation": "", "expectedSalary": "", "email": "", "phone": "", "wechat": "", "github": "", "location": "", "website": "" },
  "objective": "",
  "summary": "",
  "experience": [{ "company": "", "position": "", "startDate": "YYYY-MM", "endDate": "YYYY-MM", "description": "", "isCurrent": false }],
  "education": [{ "school": "", "major": "", "degree": "", "field": "", "startDate": "YYYY-MM", "endDate": "YYYY-MM", "schoolType": "", "college": "", "city": "", "campusExperience": "" }],
  "skills": [{ "name": "", "description": "" }],
  "projects": [{ "name": "", "role": "", "city": "", "startDate": "YYYY-MM", "endDate": "YYYY-MM", "description": "", "link": "" }],
  "languages": [{ "name": "", "level": "" }]
}
尽可能从文本中提取信息填充各字段。
${JSON_OUTPUT_RULE}`
}
