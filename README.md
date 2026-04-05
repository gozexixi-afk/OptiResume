# OptiResume

基于 **Vue 3** 的现代化单页简历编辑器，支持实时预览、多模板、本地持久化，并集成多家大模型 API 以辅助优化、翻译与解析简历内容。



---

## 功能概览

| 模块 | 说明 |
|------|------|
| **编辑区** | 个人信息（含头像）、求职意向、工作经历/教育背景（可排序）、技能标签、项目、自我评价（TipTap 富文本）、语言能力、自定义模块 |
| **预览区** | 与编辑区实时同步；三种模板（经典 / 现代 / 简约）；缩放滑块 |
| **主题与语言** | 浅色 / 深色（Element Plus 暗黑变量）；中文 / 英文（Vue I18n） |
| **导入 / 导出** | PDF（html2canvas + jsPDF）、单文件 HTML、JSON 备份与恢复（Element Upload） |
| **AI 助手** | 选择厂商与模型、填写 API Key；支持优化简历、按职位生成片段、中英互译、粘贴文本解析等（请求体中不包含头像 base64，写入结果后保留本地头像） |

---

## 技术栈

- **框架**: Vue 3 + Composition API + TypeScript
- **构建**: Vite 8
- **UI**: Element Plus + @element-plus/icons-vue
- **状态**: Pinia
- **国际化**: Vue I18n（默认 `zh-CN`，可切换 `en-US`）
- **富文本**: TipTap（Vue 3）
- **工具**: html2canvas、jspdf、uuid、jsonrepair（解析模型返回的不规范 JSON）
- **样式**: SCSS + CSS 变量

---

## 目录结构

```
src/
├── components/
│   ├── common/          # 富文本编辑器、AI 对话框
│   ├── editor/          # 各编辑表单模块
│   ├── preview/         # 预览工具栏（模板 Tab、缩放）
│   └── templates/       # 三套简历模板
├── composables/
├── stores/              # Pinia：resume、settings（含 AI 配置）
├── i18n/                # zh-CN.ts、en-US.ts
├── utils/               # ai.ts、export.ts
├── types/
├── assets/styles/
├── App.vue
└── main.ts
```

---

## 快速开始

### 环境要求

- [Node.js](https://nodejs.org/) 18+（推荐 LTS）

### 安装与运行

```bash
git clone <你的仓库地址>
cd OptiResume
npm install
npm run dev
```

浏览器访问终端提示的本地地址（默认多为 `http://localhost:5173`）。

### 生产构建

```bash
npm run build
npm run preview   # 本地预览 dist
```

产物目录：`dist/`，可部署到任意静态托管（GitHub Pages、Nginx、OSS 等）。

---

## AI 功能说明

1. 在应用内打开 **AI 助手**，选择厂商与模型，填写对应平台的 **API Key**（可选填 **自定义接口** 以走自建代理）。
2. **DeepSeek** 在开发环境下，默认通过 Vite 将请求代理到 `https://api.deepseek.com`，减轻浏览器 **CORS** 问题（见 `vite.config.ts` 中 `/api/deepseek`）。
3. **生产环境**若直接访问各厂商域名仍被 CORS 拦截，需在网关或后端做反向代理，并在 AI 配置中填写你的代理地址。
4. API Key 与简历草稿均保存在浏览器 **localStorage**，不上传服务器；请注意在公共电脑上使用时的隐私风险。
5. 若接口返回 **余额不足**、**限流** 等错误，界面会尽量展示可读提示，请前往对应平台充值或更换 Key。

各厂商 OpenAI 兼容接口与模型列表以 `src/utils/ai.ts` 为准；DeepSeek 官方文档：<https://api-docs.deepseek.com/zh-cn/>

---

## 常见问题

- **PDF 导出样式异常**：尽量在预览区完整渲染后再导出；复杂样式可能受 html2canvas 限制。
- **AI 返回 JSON 解析失败**：已使用 `jsonrepair` 与提示词约束；超长简历可尝试缩短「自我评价」等字段后再调用。
- **仅静态部署**：本项目无后端，所有 AI 请求由浏览器发起，需自行处理跨域与密钥安全策略。

---

## 脚本说明

| 命令 | 作用 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 类型检查 + 生产构建 |
| `npm run preview` | 预览构建结果 |

---

## 开源协议

若未特别指定，可随仓库自行添加 `LICENSE`（例如 MIT）。欢迎 Issue / PR 改进。

---


