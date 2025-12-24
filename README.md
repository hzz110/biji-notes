# 📝 在线笔记应用 (Biji)

一个简洁美观的在线笔记应用，使用 React + TypeScript + Vite 构建，部署在 Cloudflare Pages 上。

## ✨ 功能特性

- 📝 创建、编辑和删除笔记
- 🔍 实时搜索笔记
- 💾 数据存储在 Cloudflare D1 数据库（SQLite）
- 🌐 跨设备同步，数据云端存储
- 📱 响应式设计，支持移动端
- 🎨 现代化的用户界面
- ⚡ 快速加载，基于 Vite 构建
- 🚀 使用 Cloudflare Pages Functions 提供 API

## 🚀 快速开始

### 本地开发

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 在浏览器中打开 `http://localhost:5173`

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

## 📦 部署到 Cloudflare Pages

### 方法一：通过 GitHub 自动部署（推荐）

1. **将代码推送到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/你的用户名/biji-notes.git
   git push -u origin main
   ```

2. **在 Cloudflare Dashboard 中设置**
   - 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - 进入 **Pages** 部分
   - 点击 **Create a project**
   - 选择 **Connect to Git**
   - 选择你的 GitHub 仓库
   - 配置构建设置：
     - **Build command**: `npm run build`
     - **Build output directory**: `dist`
     - **Root directory**: `/` (默认)
   - 点击 **Save and Deploy**

3. **配置环境变量（可选）**
   - 在 Cloudflare Pages 项目设置中
   - 进入 **Settings** > **Environment variables**
   - 添加需要的环境变量

### 方法二：使用 GitHub Actions 自动部署

1. **获取 Cloudflare API Token**
   - 在 Cloudflare Dashboard 中
   - 进入 **My Profile** > **API Tokens**
   - 点击 **Create Token**
   - 使用 **Edit Cloudflare Workers** 模板
   - 或者自定义权限：
     - Account: Cloudflare Pages: Edit
     - Zone: Zone Settings: Read, Zone: Read
   - 复制生成的 Token

2. **获取 Account ID**
   - 在 Cloudflare Dashboard 右侧栏找到 **Account ID**

3. **在 GitHub 仓库中添加 Secrets**
   - 进入你的 GitHub 仓库
   - 点击 **Settings** > **Secrets and variables** > **Actions**
   - 添加以下 Secrets：
     - `CLOUDFLARE_API_TOKEN`: 你的 API Token
     - `CLOUDFLARE_ACCOUNT_ID`: 你的 Account ID

4. **推送代码到 main 分支**
   ```bash
   git push origin main
   ```

   GitHub Actions 会自动构建并部署到 Cloudflare Pages。

### 方法三：使用 Wrangler CLI 手动部署

1. **安装 Wrangler**
   ```bash
   npm install -g wrangler
   ```

2. **登录 Cloudflare**
   ```bash
   wrangler login
   ```

3. **构建项目**
   ```bash
   npm run build
   ```

4. **部署到 Cloudflare Pages**
   ```bash
   wrangler pages deploy dist --project-name=biji-notes
   ```

## 📁 项目结构

```
biji/
├── src/
│   ├── components/          # React 组件
│   │   ├── NoteList.tsx     # 笔记列表组件
│   │   ├── NoteList.css
│   │   ├── NoteEditor.tsx   # 笔记编辑器组件
│   │   └── NoteEditor.css
│   ├── App.tsx              # 主应用组件
│   ├── App.css
│   ├── main.tsx             # 应用入口
│   ├── types.ts             # TypeScript 类型定义
│   └── index.css            # 全局样式
├── index.html               # HTML 模板
├── package.json             # 项目配置
├── vite.config.ts           # Vite 配置
├── tsconfig.json            # TypeScript 配置
├── .gitignore
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions 工作流
└── README.md
```

## 🛠️ 技术栈

- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **CSS3** - 样式
- **Cloudflare D1** - SQLite 数据库
- **Cloudflare Pages Functions** - 服务器端 API

## 📝 使用说明

1. **创建笔记**：点击右上角的"新建笔记"按钮
2. **编辑笔记**：在左侧列表中选择笔记，在右侧编辑器中编辑
3. **搜索笔记**：在顶部搜索框中输入关键词
4. **删除笔记**：在笔记列表中点击笔记右上角的 × 按钮

## 🔒 数据存储

所有笔记数据存储在 **Cloudflare D1** 数据库中（基于 SQLite）。D1 是 Cloudflare 的全球分布式数据库，提供：

- ✅ 数据持久化存储
- ✅ 跨设备同步
- ✅ 全球边缘网络加速
- ✅ 免费计划：5GB 存储，每天 500 万次读取

数据通过 Cloudflare Pages Functions API 进行 CRUD 操作，确保数据安全和一致性。

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**注意**：应用使用 Cloudflare D1 数据库存储数据，需要按照 `DEPLOY.md` 中的说明配置数据库。部署后，数据将存储在 Cloudflare 的全球边缘网络中，支持跨设备访问和同步。

